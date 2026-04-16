# Quran JSON Data

This directory stores the dataset fetched from [semarketir/quranjson](https://github.com/semarketir/quranjson).

## Download

Run the following command from the `apps/backend` workspace:

```bash
pnpm run download-data   # uses bun internally
```

> Requires [Bun](https://bun.sh) to be installed.

## Data structure

```
data/
├── surah.json                          # Index of all 114 surahs
├── juz.json                            # Index of all 30 juz
├── surah/
│   ├── surah_1.json                    # Al-Fatihah (Arabic text)
│   └── surah_<2-114>.json
├── tajweed/
│   └── surah_<1-114>.json             # Tajweed-annotated text
└── translation/
    └── en/
        └── en_translation_<1-114>.json # English translation
```

## Raw API base URL

```
https://raw.githubusercontent.com/semarketir/quranjson/master/source/
```

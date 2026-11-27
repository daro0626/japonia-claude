# Moja mała Japonia — źródła i licencje

- **Głosy:** VOICEVOX:東北イタコ, VOICEVOX:九州そら, VOICEVOX:青山龍星, VOICEVOX:玄野武宏. Nagrania wygenerowane lokalnie programem VOICEVOX CORE 0.16 (https://voicevox.hiroshiba.jp/) zgodnie z regulaminem oprogramowania i regulaminami postaci; użycie niekomercyjne, z podaniem nazw głosów.
- **Dane kresek:** KanjiVG © Ulrich Apel — CC BY-SA 3.0 (https://kanjivg.tagaini.net/). Plik `strokes.json` jest pochodną i jest udostępniany na tej samej licencji.
- **Kontrola odczytów:** Open JTalk / NAIST Japanese Dictionary (słownik używany wyłącznie w narzędziu kontrolnym, nie w aplikacji).
- **Krój pisma:** Klee One © The Klee Project Authors — SIL Open Font License 1.1 (tekst licencji: `fonts/KleeOne-OFL.txt`).
- **Oprogramowanie:** Svelte (MIT), Vite (MIT), idb (ISC).
- **Ilustracje i maskotka Tomo:** własne grafiki SVG projektu.
- **Wybór głosów (etap II, 27.11.2026):** porównanie zrozumiałości 12 konfiguracji na 15 próbkach i 28 krótkich słowach przez automatyczne rozpoznawanie mowy ReazonSpeech (sherpa-onnx, Apache-2.0, użyte tylko do kontroli). Nie był to odsłuch człowieka.
- **Jakość językowa:** treść przygotowana z pomocą AI i sprawdzona automatycznie. Nie była recenzowana przez native speakera.
- **Rozpoznawanie mowy na telefonie (od 2.1, pobierane na życzenie, katalog `asr/`):** **Powered by Moonshine AI** — model Moonshine v2 tiny-ja (quantized), This Moonshine AI Model is licensed under the Moonshine AI Community License, Copyright © Moonshine AI Ltd. All Rights Reserved (pełny tekst: `asr/MOONSHINE-LICENSE.txt`, informacja: `asr/NOTICE.txt`); użyty bez zmian, do osobistej, niekomercyjnej nauki. Eksport ONNX/ORT: sherpa-onnx (k2-fsa, Apache-2.0). Silnik: onnxruntime-web (MIT, `asr/ort/LICENSE.txt`).
- **Słownik odczytów do porównywania rozpoznanego tekstu:** pochodny od IPADIC © Nara Institute of Science and Technology (licencja: `asr/IPADIC-LICENSE.txt`), zbudowany skryptem projektu z pakietu mecab-ipadic-seed.

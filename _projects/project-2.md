---
title: "ZOLL AED Plus Simulator"
excerpt: "A comprehensive medical device simulator that simulates an AED, featuring real-time ECG signal generation, manual shock delivery protocols, and CPR level monitoring. The simulator provides interactive visual feedback through dynamic ECG waveforms, compression strength analysis, and a multi-stage LED guidance system that walks users through the entire resuscitation process. The project was built with state-driven architecture that accurately models medical device behavior, including electrode pad detection, compression depth monitoring, and synchronized audio-visual cues for training and educational scenarios."
# date: 2024-03-01
date_range: "Sept 2023 - Dec 2023"
status: "active"
carousel_id: "zoll-aed-plus-simulator"
github_url: "https://github.com/johnnyl77/COMP3004-Zoll-Aed-Plus-Simulator"
technologies:
  - C++
  - Qt Framework
  - QCustomPlot
  # - qmake
  - Multi-Threading
  - Linux
  - GitHub
order: 10
carousel_slides:
  - type: video
    url: https://www.youtube.com/watch?v=CEoJp0T7eWs
    alt: Adult with VT who recovers in 3 shocks
    caption: Ventricular Tachycardia scenario demonstrating electrode pad attachment, rhythm analysis, and manual shock delivery with CPR feedback.
  - type: video
    url: https://www.youtube.com/watch?v=8HBUur-FuHI
    alt: Performing Weak CPR on a Patient
    caption: Sinus rhythm scenario testing weak CPR compressions with real-time depth monitoring and feedback system
  - type: video
    url: https://www.youtube.com/watch?v=7NAG3h1t4T4
    alt: Child with SR (Sinus Rhythm) recovers using a working AED
    caption: Pediatric sinus rhythm scenario demonstrating pad placement verification, normal rhythm analysis with no-shock advisory, and CPR coaching to recovery.
  - type: image
    url: /files/zoll-aed-plus/zoll-aed-device.png
    alt: ZOLL AED Plus Device Interface
    caption: Interactive simulator interface featuring ECG waveform display, compression monitoring, and LED guidance system
---
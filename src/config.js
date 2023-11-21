export const OperatingSystems = {
    "windows": [
        "Windows NT 10.0; Win64; x64", // Windows 10
        "Windows NT 6.1; Win64; x64",  // Windows 7
        "Windows NT 6.2; Win64; x64",  // Windows 8
        "Windows NT 6.3; Win64; x64",  // Windows 8.1
        // Windows 11 variants
        "Windows NT 10.0; Win64; ARM64", // Windows 11 ARM
        "Windows NT 10.0; Win64; x64"    // Windows 11 x64
    ],

    "mac": [
        "Macintosh; Intel Mac OS X 10_15_7", // Catalina
        "Macintosh; Intel Mac OS X 10_15_6",
        "Macintosh; Intel Mac OS X 11_0_1",  // Big Sur
        "Macintosh; Intel Mac OS X 11_2_3",
        "Macintosh; Intel Mac OS X 11_4",
        "Macintosh; Intel Mac OS X 12_0",    // Monterey
        "Macintosh; Intel Mac OS X 12_1",
        "Macintosh; Intel Mac OS X 12_2"
    ],

    "linux": [
        "X11; Linux x86_64",              // Generic Linux x64
        "X11; Ubuntu; Linux x86_64",      // Ubuntu specific
        "X11; Fedora; Linux x86_64",      // Fedora specific
        "X11; Linux i686",                // Generic Linux x86
        "X11; Debian; Linux x86_64",      // Debian specific
        "X11; CentOS; Linux x86_64",      // CentOS specific
        "X11; OpenSUSE; Linux x86_64",    // OpenSUSE specific
        "X11; Linux; Android 9",          // Android Linux variant
        "X11; Linux; Android 10",
        "X11; Linux; Android 11"
    ]
};

export const BrowserVersions = {
    "edge": [
        "91.0.864", // Mid-2021
        "92.0.902",
        "93.0.961",
        "94.0.992",
        "95.0.1020",
        "96.0.1054",
        "97.0.1072",
        "98.0.1108",
        "99.0.1150"
    ],

    "ie": [
        "11.0" // Last version of IE
    ],

    "chrome": [
        "91.0.4472", // Mid-2021
        "92.0.4515",
        "93.0.4577",
        "94.0.4606",
        "95.0.4638",
        "96.0.4664",
        "97.0.4692",
        "98.0.4758",
        "99.0.4844"
    ],

    "firefox": [
        "88.0", // Early 2021
        "89.0",
        "90.0",
        "91.0",
        "92.0",
        "93.0",
        "94.0",
        "95.0",
        "96.0",
        "97.0"
    ],

    "safari": [
        "13.1", // Late 2020
        "14.0",
        "14.1",
        "15.0",
        "15.1",
        "15.2",
        "15.3",
        "15.4",
        "15.5",
        "15.6"
    ],

    "opera": [
        "76.0.4017", // Mid-2021
        "77.0.4054",
        "78.0.4093",
        "79.0.4143",
        "80.0.4170",
        "81.0.4196",
        "82.0.4227",
        "83.0.4254",
        "84.0.4316",
        "85.0.4341"
    ]
}
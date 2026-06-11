```Mermaid
graph TD

    A[src]

    %% Atoms
    A --> B[atoms]
    B --> B1[bootstrapToast]
    B --> B2[colorSettings]
    B --> B3[filters]
    B --> B4[like]
    B --> B5[loader]
    B --> B6[productsManage]
    B --> B7[pymentModal]
    B --> B8[seo]
    B --> B9[toasts]

    %% Components
    A --> C[components]

    C --> C1[footer]
    C --> C2[navbar]
    C --> C3[pages]
    C --> C4[settings]

    %% Navbar
    C2 --> C21[theme]
    C2 --> C22[userManage]

    %% Pages
    C3 --> P1[ads]
    C3 --> P2[chatBox]
    C3 --> P3[home]
    C3 --> P4[payment]
    C3 --> P5[products]
    C3 --> P6[static pages]

    %% Settings
    C4 --> S1[customerProfile]
    C4 --> S2[profile]
    C4 --> S3[register]
    C4 --> S4[statisticspanel]
    C4 --> S5[AdminSettings]
    C4 --> S6[Login]
    C4 --> S7[Messages]
    C4 --> S8[StatisticsPanel]
    C4 --> S9[UsersManagement]

    %% Core
    A --> D[context]
    A --> E[FontAwesome]
    A --> F[helpers]
    A --> G[hooks]
    A --> H[interface]
    A --> I[locales]
    A --> J[routes]
    A --> K[services]
    A --> L[socket]

    %% Hooks
    G --> G1[ads]
    G --> G2[socket]
    G --> G3[custom hooks]

    %% Interfaces
    H --> H1[chat]
    H --> H2[auth]
    H --> H3[posts]
    H --> H4[user]
    H --> H5[shared types]

    %% Locales
    I --> I1[ar]
    I --> I2[en]
    I --> I3[he]

    %% Root
    A --> M[App.tsx]
    A --> N[main.tsx]

    %% Utils
    ROOT[Project Root]

    ROOT --> U[utils]
    U --> U1[JsonLd]
    U --> U2[PrivacyPolicyJsonLd]
    U --> U3[structuredData]

    ROOT --> ENV[Environment Files]
    ROOT --> CFG[Configs]
    ROOT --> PKG[package.json]
    ROOT --> README[README.md]
```
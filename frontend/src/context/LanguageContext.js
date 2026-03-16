import React, { createContext, useState, useContext } from 'react';

const translations = {
  en: {
    dashboard: "Coordination Dashboard",
    registration: "New Registration",
    verify: "Verify Record",
    public: "Public Portal",
    logout: "Logout",
    logged_in_as: "Logged in as",
    network_online: "Network Online",
    network_offline: "Network Offline",
    blockchain_active: "Blockchain: Active",
    total_records: "Network Records",
    missing_alerts: "Missing Alerts",
    interventions: "Interventions",
    reunifications: "Reunifications",
    register_child: "Register Child",
    name: "Full Name",
    age: "Age",
    gender: "Gender",
    location: "Location",
    gps_tagging: "GPS Geo-Tagging",
    save_locally: "Save Encrypted Locally",
    register_notify: "Register & Notify Network",
    processing_audit: "Processing Audit Logs...",
    overview: "Overview",
    aid_tracking: "Aid Tracking",
    photos: "Photos",
    guardian: "Guardian",
    risk_profile: "AI Risk Profile",
    life_progress: "Life Progress Timeline"
  },
  sw: {
    dashboard: "Dashibodi ya Uratibu",
    registration: "Usajili Mpya",
    verify: "Thibitisha Rekodi",
    public: "Tovuti ya Umma",
    logout: "Ondoka",
    logged_in_as: "Umeingia kama",
    network_online: "Mtandao Uko Hewani",
    network_offline: "Mtandao Umekatika",
    blockchain_active: "Blockchain: Imekubaliwa",
    total_records: "Rekodi za Mtandao",
    missing_alerts: "Tahadhari za Waliopotea",
    interventions: "Misaada Iliyotolewa",
    reunifications: "Kuunganishwa na Familia",
    register_child: "Sajili Mtoto",
    name: "Jina Kamili",
    age: "Umri",
    gender: "Jinsia",
    location: "Mahali",
    gps_tagging: "Kuweka Alama ya GPS",
    save_locally: "Hifadhi Kwenye Kifaa",
    register_notify: "Sajili na Arifu Mtandao",
    processing_audit: "Inachakata Kumbukumbu...",
    overview: "Muhtasari",
    aid_tracking: "Ufuatiliaji wa Misaada",
    photos: "Picha",
    guardian: "Mlezi",
    risk_profile: "Wasifu wa Hatari (AI)",
    life_progress: "Mstari wa Wakati wa Maisha"
  },
  sheng: {
    dashboard: "Dashibodi ya Works",
    registration: "Kusajili Mbogi",
    verify: "Ku-check Rekodi",
    public: "Portal ya mtaa",
    logout: "Ku-log out",
    logged_in_as: "Ume-ingia kama",
    network_online: "Net iko chonjo",
    network_offline: "Net ime-nyonga",
    blockchain_active: "Blockchain: Iko active",
    total_records: "Rekodi za mtaa",
    missing_alerts: "Wasee wame-lose",
    interventions: "Misaada",
    reunifications: "Kurudi mtaani",
    register_child: "Sajili mtoi",
    name: "Jina msee",
    age: "Miaka",
    gender: "Jinsia",
    location: "Mtaa",
    gps_tagging: "GPS Geo-Tagging",
    save_locally: "Save kwa simu",
    register_notify: "Sajili na u-alert mtaa",
    processing_audit: "Ina-process log...",
    overview: "Vile kuko",
    aid_tracking: "Track misaada",
    photos: "Picha",
    guardian: "Mlezi",
    risk_profile: "Vile mtoi ako (AI)",
    life_progress: "Maisha vile ime-go"
  }
};

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');

  const t = (key) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);

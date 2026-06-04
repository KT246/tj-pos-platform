"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from "react";

export type Language = "en" | "lo";

const STORAGE_KEY = "tj-pos-web-language";

const lo: Record<string, string> = {
  Home: "ໜ້າຫຼັກ",
  "POS Types": "ປະເພດ POS",
  Features: "ຟີເຈີ",
  Pricing: "ລາຄາ",
  "Add-ons": "ໂມດູນເສີມ",
  "FAQ/Help": "ຄຳຖາມ/ຊ່ວຍເຫຼືອ",
  Contact: "ຕິດຕໍ່",
  Login: "ເຂົ້າລະບົບ",
  "Request Demo": "ຂໍດູເດໂມ",
  "Contact TJ POS": "ຕິດຕໍ່ TJ POS",
  "Explore Features": "ເບິ່ງຟີເຈີ",
  "Explore Pricing": "ເບິ່ງລາຄາ",
  "View FAQ/Help": "ເບິ່ງຄຳຖາມ/ຊ່ວຍເຫຼືອ",
  "Back to website": "ກັບໄປໜ້າເວັບ",

  "#1 POS Solution in Laos": "ໂຊລູຊັນ POS ອັນດັບ 1 ໃນລາວ",
  "Run Your Business Smarter with": "ບໍລິຫານທຸລະກິດໃຫ້ສະຫຼາດຂຶ້ນດ້ວຍ",
  "A complete, cloud-based POS platform for Retail, Cafe, Restaurant, Beauty and Hospitality businesses. Easy to use. Powerful features. Built for Laos.":
    "ແພລດຟອມ POS ຜ່ານຄລາວດ໌ຄົບວົງຈອນສຳລັບຮ້ານຄ້າ, ຄາເຟ, ຮ້ານອາຫານ, ຄວາມງາມ ແລະ ທຸລະກິດບໍລິການ. ໃຊ້ງານງ່າຍ, ຟີເຈີຄົບ, ສ້າງສຳລັບລາວ.",
  "Built for Every Business Type": "ສ້າງມາສຳລັບທຸລະກິດທຸກປະເພດ",
  "Powerful features tailored to how your business works.":
    "ຟີເຈີທີ່ປັບໃຫ້ເໝາະກັບວິທີເຮັດວຽກຂອງທຸລະກິດທ່ານ.",
  "View All POS Types": "ເບິ່ງປະເພດ POS ທັງໝົດ",
  "Powerful Features to Grow Your Business": "ຟີເຈີທີ່ຊ່ວຍໃຫ້ທຸລະກິດເຕີບໂຕ",
  "Simple Packages, One Powerful Platform": "ແພັກເກດງ່າຍໆ ໃນແພລດຟອມທີ່ຊົງພະລັງ",
  "Choose the plan that fits your business.": "ເລືອກແຜນທີ່ເໝາະກັບທຸລະກິດຂອງທ່ານ.",
  Monthly: "ລາຍເດືອນ",
  "Yearly (Save 20%)": "ລາຍປີ (ປະຫຍັດ 20%)",
  "All plans include cloud access, offline mode, backups and local support in Laos.":
    "ທຸກແຜນລວມການໃຊ້ງານຜ່ານຄລາວດ໌, ໂໝດອອບລາຍ, ການສຳຮອງຂໍ້ມູນ ແລະ ການຊ່ວຍເຫຼືອໃນລາວ.",
  "Add-ons to Do More": "ໂມດູນເສີມເພື່ອເຮັດໄດ້ຫຼາຍຂຶ້ນ",
  "Extend TJ POS with powerful add-ons.": "ຂະຫຍາຍ TJ POS ດ້ວຍໂມດູນເສີມທີ່ຊົງພະລັງ.",
  "Trusted by Businesses Across Laos": "ໄດ້ຮັບຄວາມໄວ້ວາງໃຈຈາກທຸລະກິດທົ່ວລາວ",
  "What Our Customers Say": "ລູກຄ້າຂອງພວກເຮົາເວົ້າຫຍັງ",
  "TJ POS helped us manage our cafe more efficiently.":
    "TJ POS ຊ່ວຍໃຫ້ພວກເຮົາບໍລິຫານຄາເຟໄດ້ມີປະສິດທິພາບຂຶ້ນ.",
  "Reports and inventory features save us hours every day.":
    "ຟີເຈີລາຍງານ ແລະ ສິນຄ້າຄົງຄັງຊ່ວຍປະຫຍັດເວລາຫຼາຍຊົ່ວໂມງທຸກມື້.",
  "Owner, Local Business": "ເຈົ້າຂອງ, ທຸລະກິດທ້ອງຖິ່ນ",
  FAQ: "ຄຳຖາມທີ່ພົບເລື້ອຍ",
  "Is TJ POS cloud-based?": "TJ POS ເປັນລະບົບຄລາວດ໌ບໍ?",
  "Can I use TJ POS offline?": "ສາມາດໃຊ້ TJ POS ແບບອອບລາຍໄດ້ບໍ?",
  "Do you provide support in Laos?": "ມີການຊ່ວຍເຫຼືອໃນລາວບໍ?",
  "Ready to Transform Your Business?": "ພ້ອມປ່ຽນທຸລະກິດຂອງທ່ານແລ້ວບໍ?",
  "Let us show you how TJ POS can help you sell more and manage easier.":
    "ໃຫ້ພວກເຮົາສະແດງວ່າ TJ POS ຊ່ວຍໃຫ້ທ່ານຂາຍໄດ້ຫຼາຍຂຶ້ນ ແລະ ບໍລິຫານງ່າຍຂຶ້ນໄດ້ແນວໃດ.",

  Retail: "ຮ້ານຄ້າປີກ",
  Cafe: "ຄາເຟ",
  Restaurant: "ຮ້ານອາຫານ",
  Beauty: "ຄວາມງາມ",
  Hospitality: "ທີ່ພັກ/ບໍລິການ",
  "Retail POS": "POS ຮ້ານຄ້າປີກ",
  "Cafe POS": "POS ຄາເຟ",
  "Restaurant POS": "POS ຮ້ານອາຫານ",
  "Beauty POS": "POS ຄວາມງາມ",
  "Hospitality POS": "POS ທີ່ພັກ/ບໍລິການ",
  "Barcode and SKU management": "ຈັດການ Barcode ແລະ SKU",
  "Quick order and billing": "ສັ່ງອໍເດີ ແລະ ອອກບິນໄດ້ໄວ",
  "Table management and floor plan": "ຈັດການໂຕະ ແລະ ແຜນຜັງຮ້ານ",
  "Appointment scheduling": "ຈັດຕາຕະລາງນັດໝາຍ",
  "Room and reservation management": "ຈັດການຫ້ອງ ແລະ ການຈອງ",
  "Learn more": "ຮຽນຮູ້ເພີ່ມ",

  "Sales & Billing": "ການຂາຍ ແລະ ອອກບິນ",
  "Inventory Management": "ຈັດການສິນຄ້າຄົງຄັງ",
  "Reports & Analytics": "ລາຍງານ ແລະ ວິເຄາະ",
  "Customer Management": "ຈັດການລູກຄ້າ",
  "Employee Management": "ຈັດການພະນັກງານ",
  "Multi-Store Management": "ຈັດການຫຼາຍສາຂາ",
  "Inventory Control": "ຄວບຄຸມສິນຄ້າຄົງຄັງ",
  "Staff Management": "ຈັດການພະນັກງານ",
  "Multi-branch Management": "ຈັດການຫຼາຍສາຂາ",
  "Branding & Receipts": "ແບຣນດ໌ ແລະ ໃບຮັບເງິນ",
  "Payment Methods": "ວິທີຊຳລະເງິນ",
  "Fast billing, multiple payment methods and receipts.":
    "ອອກບິນໄວ, ຮອງຮັບຫຼາຍວິທີຊຳລະເງິນ ແລະ ໃບຮັບເງິນ.",
  "Real-time stock tracking, alerts and adjustments.":
    "ຕິດຕາມສະຕ໋ອກແບບ real-time, ແຈ້ງເຕືອນ ແລະ ປັບປຸງໄດ້.",
  "Insightful reports to track performance anytime.":
    "ລາຍງານເຊິງລຶກເພື່ອຕິດຕາມຜົນງານໄດ້ທຸກເວລາ.",
  "Build customer profiles and reward loyalty.":
    "ສ້າງໂປຣໄຟລ໌ລູກຄ້າ ແລະ ໃຫ້ລາງວັນຄວາມຈົງຮັກພັກດີ.",
  "Manage staff, roles, permissions and shifts.":
    "ຈັດການພະນັກງານ, ບົດບາດ, ສິດທິ ແລະ ກະວຽກ.",
  "Centralized control for multiple locations.": "ຄວບຄຸມຫຼາຍສະຖານທີ່ຈາກສູນກາງ.",

  Starter: "ເລີ່ມຕົ້ນ",
  Professional: "ໂປຣເຟດຊັນນອນ",
  Business: "ທຸລະກິດ",
  Enterprise: "ອົງກອນ",
  Pro: "ໂປຣ",
  "Most Popular": "ນິຍົມທີ່ສຸດ",
  "For small businesses": "ສຳລັບທຸລະກິດຂະໜາດນ້ອຍ",
  "For growing businesses": "ສຳລັບທຸລະກິດທີ່ກຳລັງເຕີບໂຕ",
  "For established businesses": "ສຳລັບທຸລະກິດທີ່ພ້ອມຂະຫຍາຍ",
  "For large organizations": "ສຳລັບອົງກອນຂະໜາດໃຫຍ່",
  "1 Store": "1 ຮ້ານ",
  "2 Users": "2 ຜູ້ໃຊ້",
  "Basic Features": "ຟີເຈີພື້ນຖານ",
  "Up to 3 Stores": "ສູງສຸດ 3 ຮ້ານ",
  "5 Users": "5 ຜູ້ໃຊ້",
  "Advanced Features": "ຟີເຈີຂັ້ນສູງ",
  "Up to 10 Stores": "ສູງສຸດ 10 ຮ້ານ",
  "15 Users": "15 ຜູ້ໃຊ້",
  "Advanced Reports": "ລາຍງານຂັ້ນສູງ",
  "Custom Pricing": "ລາຄາຕາມຄວາມຕ້ອງການ",
  "Unlimited Stores": "ຮ້ານບໍ່ຈຳກັດ",
  "Unlimited Users": "ຜູ້ໃຊ້ບໍ່ຈຳກັດ",
  "Custom Integrations": "ການເຊື່ອມຕໍ່ຕາມຕ້ອງການ",
  "Get Started": "ເລີ່ມໃຊ້ງານ",
  "Contact Sales": "ຕິດຕໍ່ຝ່າຍຂາຍ",
  Add: "ເພີ່ມ",
  More: "ເພີ່ມເຕີມ",
  "View All": "ເບິ່ງທັງໝົດ",
  "Loyalty Program": "ໂປຣແກຣມສະສົມຄະແນນ",
  "Online Ordering": "ສັ່ງອາຫານອອນລາຍ",
  "Kitchen Display (KDS)": "ຈໍຄົວ (KDS)",
  "E-Invoicing": "ໃບກຳກັບພາສີອິເລັກໂທຣນິກ",
  "View All Add-ons": "ເບິ່ງໂມດູນເສີມທັງໝົດ",
  "Reward your customers and increase retention.":
    "ໃຫ້ລາງວັນລູກຄ້າ ແລະ ເພີ່ມການກັບມາໃຊ້ຊ້ຳ.",
  "Let customers order online and pay easily.":
    "ໃຫ້ລູກຄ້າສັ່ງອອນລາຍ ແລະ ຊຳລະເງິນໄດ້ງ່າຍ.",
  "Improve kitchen efficiency and order accuracy.":
    "ເພີ່ມປະສິດທິພາບຄົວ ແລະ ຄວາມແມ່ນຍຳຂອງອໍເດີ.",
  "Create e-invoices compliant with regulations.":
    "ສ້າງໃບກຳກັບພາສີອິເລັກໂທຣນິກຕາມຂໍ້ກຳນົດ.",
  "Explore more integrations and tools.": "ສຳຫຼວດການເຊື່ອມຕໍ່ ແລະ ເຄື່ອງມືອື່ນໆ.",

  "No Installation": "ບໍ່ຕ້ອງຕິດຕັ້ງ",
  "100% Cloud-based": "ໃຊ້ງານຜ່ານຄລາວດ໌ 100%",
  "Works Offline": "ໃຊ້ງານອອບລາຍໄດ້",
  "Keep selling always": "ຂາຍໄດ້ຕໍ່ເນື່ອງ",
  "Local Support": "ຊ່ວຍເຫຼືອໃນລາວ",
  "Here in Laos": "ຢູ່ໃນລາວ",
  "Secure & Reliable": "ປອດໄພ ແລະ ເຊື່ອຖືໄດ້",
  "Enterprise-grade security": "ຄວາມປອດໄພລະດັບອົງກອນ",

  "Everything You Need, Built Into": "ທຸກຢ່າງທີ່ຕ້ອງການ ຢູ່ໃນ",
  "Powerful core features to run your business smoothly. Simple to use. Easy to manage. Built to help you grow.":
    "ຟີເຈີຫຼັກທີ່ຊ່ວຍໃຫ້ທຸລະກິດເຮັດວຽກລື່ນໄຫຼ. ໃຊ້ງ່າຍ, ຈັດການງ່າຍ, ຊ່ວຍໃຫ້ເຕີບໂຕ.",
  "Core Features Included in Every Plan": "ຟີເຈີຫຼັກທີ່ມີໃນທຸກແຜນ",
  "Optional Add-ons Extend Your System": "ໂມດູນເສີມຊ່ວຍຂະຫຍາຍລະບົບຂອງທ່ານ",

  "POS Types for": "ປະເພດ POS ສຳລັບ",
  "Every Business": "ທຸລະກິດທຸກປະເພດ",
  "TJ POS supports multiple business models across Laos. Choose the right POS type that fits your operations and helps you grow.":
    "TJ POS ຮອງຮັບຫຼາຍຮູບແບບທຸລະກິດໃນລາວ. ເລືອກປະເພດ POS ທີ່ເໝາະກັບການດຳເນີນງານ ແລະ ຊ່ວຍໃຫ້ເຕີບໂຕ.",
  "Choose the Right POS Type for Your Business": "ເລືອກປະເພດ POS ທີ່ເໝາະກັບທຸລະກິດ",
  "Designed to match the way you sell, serve, and manage.":
    "ອອກແບບໃຫ້ເໝາະກັບວິທີຂາຍ, ບໍລິການ ແລະ ບໍລິຫານ.",
  "Powerful Capabilities Shared Across All POS Types":
    "ຄວາມສາມາດຫຼັກທີ່ໃຊ້ຮ່ວມໃນ POS ທຸກປະເພດ",
  "One platform. All the essentials you need.": "ແພລດຟອມດຽວ. ມີທຸກຢ່າງທີ່ຈຳເປັນ.",
  "Not sure which POS type fits you best?": "ຍັງບໍ່ແນ່ໃຈວ່າ POS ແບບໃດເໝາະກັບທ່ານ?",

  "Activate Only What You Need": "ເປີດໃຊ້ສະເພາະສິ່ງທີ່ຕ້ອງການ",
  "Power Up Your POS with": "ເພີ່ມພະລັງໃຫ້ POS ຂອງທ່ານດ້ວຍ",
  "Smart Add-ons": "ໂມດູນເສີມອັດສະລິຍະ",
  "TJ POS is built to grow with your business. Enable only the modules you need and extend your system anytime.":
    "TJ POS ສ້າງມາເພື່ອເຕີບໂຕກັບທຸລະກິດຂອງທ່ານ. ເປີດໃຊ້ສະເພາະໂມດູນທີ່ຕ້ອງການ ແລະ ຂະຫຍາຍໄດ້ທຸກເວລາ.",
  "Featured Add-ons": "ໂມດູນເສີມແນະນຳ",
  "All add-ons are optional and can be added anytime.":
    "ໂມດູນເສີມທັງໝົດເປັນທາງເລືອກ ແລະ ເພີ່ມໄດ້ທຸກເວລາ.",
  "Why Add-ons Matter": "ເປັນຫຍັງໂມດູນເສີມຈຶ່ງສຳຄັນ",
  "Add-ons extend TJ POS to fit your unique operations.":
    "ໂມດູນເສີມຂະຫຍາຍ TJ POS ໃຫ້ເໝາະກັບວຽກຂອງທ່ານ.",
  "Who Benefits from Add-ons?": "ໃຜໄດ້ປະໂຫຍດຈາກໂມດູນເສີມ?",
  "Increase Efficiency": "ເພີ່ມປະສິດທິພາບ",
  "Boost Revenue": "ເພີ່ມລາຍຮັບ",
  "Better Experience": "ປະສົບການທີ່ດີຂຶ້ນ",
  "with process automation": "ດ້ວຍການອັດຕະໂນມັດຂັ້ນຕອນ",
  "with better tools and insights": "ດ້ວຍເຄື່ອງມື ແລະ ຂໍ້ມູນເຊິງລຶກທີ່ດີຂຶ້ນ",
  "with faster service": "ດ້ວຍການບໍລິການທີ່ໄວຂຶ້ນ",

  "Simple Pricing for": "ລາຄາງ່າຍໆ ສຳລັບ",
  "Growing Businesses": "ທຸລະກິດທີ່ກຳລັງເຕີບໂຕ",
  "Flexible plans designed for businesses of all sizes. Start small and scale up as you grow.":
    "ແຜນລາຄາທີ່ຍືດຫຍຸ່ນສຳລັບທຸລະກິດທຸກຂະໜາດ. ເລີ່ມນ້ອຍໆ ແລະ ຂະຫຍາຍຕາມການເຕີບໂຕ.",
  "Monthly billing": "ຈ່າຍລາຍເດືອນ",
  "Yearly billing": "ຈ່າຍລາຍປີ",
  "Frequently Asked Questions": "ຄຳຖາມທີ່ພົບເລື້ອຍ",
  "Not sure which plan fits your business?": "ຍັງບໍ່ແນ່ໃຈວ່າແຜນໃດເໝາະກັບທຸລະກິດ?",

  "Get Help, Fast": "ຮັບຄວາມຊ່ວຍເຫຼືອໄດ້ໄວ",
  "Frequently Asked": "ຄຳຖາມທີ່ພົບເລື້ອຍ",
  Questions: "ຄຳຖາມ",
  "Find answers to common questions about TJ POS. Everything you need to know to run your business with confidence.":
    "ຄົ້ນຫາຄຳຕອບສຳລັບຄຳຖາມທົ່ວໄປກ່ຽວກັບ TJ POS. ທຸກຢ່າງທີ່ທ່ານຕ້ອງຮູ້ເພື່ອບໍລິຫານທຸລະກິດຢ່າງໝັ້ນໃຈ.",
  "How can we help you today?": "ມື້ນີ້ພວກເຮົາຊ່ວຍຫຍັງໄດ້ບໍ?",
  "Search for answers...": "ຄົ້ນຫາຄຳຕອບ...",
  "Setup guide": "ຄູ່ມືຕັ້ງຄ່າ",
  Payments: "ການຊຳລະເງິນ",
  Reports: "ລາຍງານ",
  "View questions and support topics.": "ເບິ່ງຄຳຖາມ ແລະ ຫົວຂໍ້ຊ່ວຍເຫຼືອ.",
  "View questions": "ເບິ່ງຄຳຖາມ",
  "Still need help?": "ຍັງຕ້ອງການຊ່ວຍເຫຼືອບໍ?",

  "We're Here to Help": "ພວກເຮົາພ້ອມຊ່ວຍ",
  "Get in Touch with": "ຕິດຕໍ່ກັບ",
  Experts: "ຜູ້ຊ່ຽວຊານ",
  "TJ POS Experts": "ຜູ້ຊ່ຽວຊານ TJ POS",
  "Have questions or need advice? Our team is ready to help you find the perfect POS solution for your business.":
    "ມີຄຳຖາມ ຫຼື ຕ້ອງການຄຳແນະນຳ? ທີມຂອງພວກເຮົາພ້ອມຊ່ວຍຊອກຫາໂຊລູຊັນ POS ທີ່ເໝາະກັບທຸລະກິດ.",
  "Send Us a Message": "ສົ່ງຂໍ້ຄວາມຫາພວກເຮົາ",
  "Fill out the form and our team will get back to you shortly.":
    "ກອກແບບຟອມ ແລະ ທີມຂອງພວກເຮົາຈະຕິດຕໍ່ກັບໄປໃນໄວໆນີ້.",
  "Full Name": "ຊື່ເຕັມ",
  "Email Address": "ອີເມວ",
  "Phone Number": "ເບີໂທ",
  "Business Type": "ປະເພດທຸລະກິດ",
  Subject: "ຫົວຂໍ້",
  Message: "ຂໍ້ຄວາມ",
  "Enter your full name": "ປ້ອນຊື່ເຕັມ",
  "Enter your email address": "ປ້ອນອີເມວ",
  "Enter your phone number": "ປ້ອນເບີໂທ",
  "Select business type": "ເລືອກປະເພດທຸລະກິດ",
  "How can we help you?": "ພວກເຮົາຊ່ວຍຫຍັງໄດ້?",
  "Please tell us more about your business needs...":
    "ກະລຸນາບອກລາຍລະອຽດຄວາມຕ້ອງການຂອງທຸລະກິດ...",
  "Send Message": "ສົ່ງຂໍ້ຄວາມ",
  "Your information is secure and never shared.":
    "ຂໍ້ມູນຂອງທ່ານປອດໄພ ແລະ ຈະບໍ່ຖືກແບ່ງປັນ.",
  "Our Office": "ສຳນັກງານຂອງພວກເຮົາ",
  "Visit us at our headquarters in Vientiane Capital.":
    "ເຂົ້າມາຢ້ຽມຢາມພວກເຮົາທີ່ສຳນັກງານໃນນະຄອນຫຼວງວຽງຈັນ.",
  "Vientiane Capital, Laos": "ນະຄອນຫຼວງວຽງຈັນ, ລາວ",
  "Let's Find the Right Solution for Your Business":
    "ມາຊອກຫາໂຊລູຊັນທີ່ເໝາະກັບທຸລະກິດຂອງທ່ານ",

  "See TJ POS in Action": "ເບິ່ງ TJ POS ໃນການໃຊ້ງານຈິງ",
  "Request a Personalized": "ຂໍເດໂມສ່ວນຕົວ",
  "TJ POS Demo": "ເດໂມ TJ POS",
  "See how TJ POS can simplify operations, boost efficiency and help your business grow. Our experts will walk you through a live demo tailored to your needs.":
    "ເບິ່ງວ່າ TJ POS ຊ່ວຍໃຫ້ວຽກງ່າຍຂຶ້ນ, ເພີ່ມປະສິດທິພາບ ແລະ ຊ່ວຍໃຫ້ທຸລະກິດເຕີບໂຕໄດ້ແນວໃດ. ຜູ້ຊ່ຽວຊານຈະສາທິດແບບສົດຕາມຄວາມຕ້ອງການ.",
  "Tell Us About Your Business": "ບອກພວກເຮົາກ່ຽວກັບທຸລະກິດຂອງທ່ານ",
  "Fill in the details below and our team will contact you to confirm your demo.":
    "ກອກລາຍລະອຽດດ້ານລຸ່ມ ແລະ ທີມງານຈະຕິດຕໍ່ເພື່ອຢືນຢັນເດໂມ.",
  "Business Name": "ຊື່ທຸລະກິດ",
  "Number of Branches": "ຈຳນວນສາຂາ",
  "Current Setup / System": "ລະບົບປັດຈຸບັນ",
  "Interested Modules": "ໂມດູນທີ່ສົນໃຈ",
  "Country / City": "ປະເທດ / ເມືອງ",
  "Preferred Demo Date": "ວັນທີ່ຕ້ອງການເດໂມ",
  "Preferred Time": "ເວລາທີ່ຕ້ອງການ",
  "Notes / Requirements": "ໝາຍເຫດ / ຄວາມຕ້ອງການ",
  "Tell us about your needs": "ບອກຄວາມຕ້ອງການຂອງທ່ານ",
  "I agree to the Terms of Service and Privacy Policy and consent to be contacted by TJ POS.":
    "ຂ້ອຍຍອມຮັບເງື່ອນໄຂການໃຊ້ບໍລິການ ແລະ ນະໂຍບາຍຄວາມເປັນສ່ວນຕົວ ແລະ ຍິນຍອມໃຫ້ TJ POS ຕິດຕໍ່.",
  "Submit Demo Request": "ສົ່ງຄຳຂໍເດໂມ",
  "Reset Form": "ລ້າງແບບຟອມ",
  "What to Expect": "ສິ່ງທີ່ຈະໄດ້ຮັບ",
  "Live Product Demo": "ເດໂມສິນຄ້າແບບສົດ",
  "Explore key features and real-time system in action.":
    "ສຳຫຼວດຟີເຈີຫຼັກ ແລະ ລະບົບ real-time ໃນການໃຊ້ງານ.",
  "Tailored to Your Needs": "ປັບໃຫ້ເໝາະກັບຄວາມຕ້ອງການ",
  "See how TJ POS works for your setup and industry.":
    "ເບິ່ງວ່າ TJ POS ເໝາະກັບລະບົບ ແລະ ອຸດສາຫະກຳຂອງທ່ານແນວໃດ.",
  "Q&A with Experts": "ຖາມ-ຕອບກັບຜູ້ຊ່ຽວຊານ",
  "Get answers to your questions on the spot.": "ຮັບຄຳຕອບສຳລັບຄຳຖາມຂອງທ່ານໄດ້ທັນທີ.",
  "Our 3-Step Demo Process": "ຂັ້ນຕອນເດໂມ 3 ຂັ້ນ",
  "Submit Your Request": "ສົ່ງຄຳຂໍຂອງທ່ານ",
  "We Confirm & Prepare": "ພວກເຮົາຢືນຢັນ ແລະ ກຽມພ້ອມ",
  "Live Demo & Consultation": "ເດໂມສົດ ແລະ ປຶກສາ",
  "Our team guides you through the right solution.": "ທີມງານຈະແນະນຳໂຊລູຊັນທີ່ເໝາະສົມ.",
  "TJ POS Supports Businesses Like Yours": "TJ POS ຮອງຮັບທຸລະກິດແບບຂອງທ່ານ",
  "Choose your business type to see how we can help you grow.":
    "ເລືອກປະເພດທຸລະກິດເພື່ອເບິ່ງວ່າພວກເຮົາຊ່ວຍໃຫ້ເຕີບໂຕໄດ້ແນວໃດ.",
  "Need help choosing the right setup?": "ຕ້ອງການຊ່ວຍເລືອກການຕັ້ງຄ່າທີ່ເໝາະບໍ?",
  "Our specialists are ready to help you find the best solution.":
    "ຜູ້ຊ່ຽວຊານພ້ອມຊ່ວຍຊອກຫາໂຊລູຊັນທີ່ດີທີ່ສຸດ.",
  "Call Us": "ໂທຫາພວກເຮົາ",
  "Ready to see TJ POS in action?": "ພ້ອມເບິ່ງ TJ POS ໃນການໃຊ້ງານຈິງບໍ?",

  "Login to TJ POS": "ເຂົ້າລະບົບ TJ POS",
  "Access Platform Admin and Business Admin from one secure entry point.":
    "ເຂົ້າໃຊ້ Platform Admin ແລະ Business Admin ຈາກຈຸດເຂົ້າທີ່ປອດໄພຈຸດດຽວ.",
  "Forgot password?": "ລືມລະຫັດຜ່ານ?",
  "Reset Your Password": "ຣີເຊັດລະຫັດຜ່ານ",
  "Enter your admin email and we will send reset instructions.":
    "ປ້ອນອີເມວແອດມິນ ແລະ ພວກເຮົາຈະສົ່ງຄຳແນະນຳການຣີເຊັດ.",
  "Send Reset Link": "ສົ່ງລິ້ງຣີເຊັດ",
  "Back to login": "ກັບໄປເຂົ້າລະບົບ",
  "Create New Password": "ສ້າງລະຫັດຜ່ານໃໝ່",
  "Set a new secure password for your TJ POS admin account.":
    "ຕັ້ງລະຫັດຜ່ານໃໝ່ທີ່ປອດໄພສຳລັບບັນຊີແອດມິນ TJ POS.",
  "Update Password": "ອັບເດດລະຫັດຜ່ານ",
  "Secure Admin Access": "ເຂົ້າໃຊ້ແອດມິນຢ່າງປອດໄພ",
  "Smart POS for": "Smart POS ສຳລັບ",
  "Manage your platform, businesses, branches and POS operations with a clean, reliable admin experience.":
    "ບໍລິຫານແພລດຟອມ, ທຸລະກິດ, ສາຂາ ແລະ ການໃຊ້ POS ດ້ວຍປະສົບການແອດມິນທີ່ສະອາດ ແລະ ເຊື່ອຖືໄດ້.",
  Password: "ລະຫັດຜ່ານ",
  "Enter your password": "ປ້ອນລະຫັດຜ່ານ",
  "Confirm Password": "ຢືນຢັນລະຫັດຜ່ານ",
  "Confirm your password": "ຢືນຢັນລະຫັດຜ່ານ",

  Dashboard: "ແດຊບອດ",
  Sales: "ການຂາຍ",
  Transactions: "ທຸລະກຳ",
  Products: "ສິນຄ້າ",
  Customers: "ລູກຄ້າ",
  Settings: "ຕັ້ງຄ່າ",
  "Vientiane Cafe": "ວຽງຈັນ ຄາເຟ",
  "Total Sales": "ຍອດຂາຍລວມ",
  "Average Order Value": "ມູນຄ່າອໍເດີສະເລ່ຍ",
  "Gross Profit": "ກຳໄລລວມ",
  "vs last week": "ທຽບກັບອາທິດກ່ອນ",
  "Sales Overview": "ພາບລວມການຂາຍ",
  "This Week": "ອາທິດນີ້",
  "Top Products": "ສິນຄ້າຂາຍດີ",
  "Recent Transactions": "ທຸລະກຳຫຼ້າສຸດ",
  "View all": "ເບິ່ງທັງໝົດ",
  "Iced Latte": "ໄອສ໌ລາເຕ້",
  "Green Tea": "ຊາຂຽວ",
  Croissant: "ຄຣົວຊອງ",
  Bagel: "ເບເກິນ",
  Brownie: "ບຣາວນີ",

  "Tailored to Your Business": "ປັບຕາມທຸລະກິດຂອງທ່ານ",
  "Personal walkthrough": "ແນະນຳແບບສ່ວນຕົວ",
  "No Obligation": "ບໍ່ມີຂໍ້ຜູກມັດ",
  "100% free": "ຟຣີ 100%",
  "Expert-Led": "ນຳໂດຍຜູ້ຊ່ຽວຊານ",
  "Live demo": "ເດໂມສົດ",
  "Secure & Private": "ປອດໄພ ແລະ ເປັນສ່ວນຕົວ",
  "Your data is safe": "ຂໍ້ມູນຂອງທ່ານປອດໄພ",

  "Tailored to your needs": "ປັບຕາມຄວາມຕ້ອງການ",
  "Billed monthly": "ຄິດເງິນລາຍເດືອນ",
  "Perfect for small businesses just getting started.":
    "ເໝາະສຳລັບທຸລະກິດນ້ອຍທີ່ເລີ່ມຕົ້ນ.",
  "Great for growing businesses that need more power.":
    "ເໝາະສຳລັບທຸລະກິດທີ່ກຳລັງເຕີບໂຕ ແລະ ຕ້ອງການພະລັງຫຼາຍຂຶ້ນ.",
  "Advanced features for high-volume operations.": "ຟີເຈີຂັ້ນສູງສຳລັບງານປະລິມານສູງ.",
  "Unlimited scale with dedicated support and customization.":
    "ຂະຫຍາຍໄດ້ບໍ່ຈຳກັດ ພ້ອມການຊ່ວຍເຫຼືອແລະປັບແຕ່ງສະເພາະ.",
  "1 Branch": "1 ສາຂາ",
  "1 POS Device": "1 ອຸປະກອນ POS",
  "Up to 5 Staff": "ສູງສຸດ 5 ພະນັກງານ",
  "Up to 2,000 Items": "ສູງສຸດ 2,000 ລາຍການ",
  "Up to 5,000 Orders / month": "ສູງສຸດ 5,000 ອໍເດີ/ເດືອນ",
  "Up to 3 Branches": "ສູງສຸດ 3 ສາຂາ",
  "Up to 3 POS Devices": "ສູງສຸດ 3 ອຸປະກອນ POS",
  "Up to 15 Staff": "ສູງສຸດ 15 ພະນັກງານ",
  "Up to 10,000 Items": "ສູງສຸດ 10,000 ລາຍການ",
  "Up to 30,000 Orders / month": "ສູງສຸດ 30,000 ອໍເດີ/ເດືອນ",
  "Up to 10 Branches": "ສູງສຸດ 10 ສາຂາ",
  "Up to 10 POS Devices": "ສູງສຸດ 10 ອຸປະກອນ POS",
  "Up to 50 Staff": "ສູງສຸດ 50 ພະນັກງານ",
  "Up to 50,000 Items": "ສູງສຸດ 50,000 ລາຍການ",
  "Up to 100,000 Orders / month": "ສູງສຸດ 100,000 ອໍເດີ/ເດືອນ",
  "Unlimited Branches": "ສາຂາບໍ່ຈຳກັດ",
  "Unlimited POS Devices": "ອຸປະກອນ POS ບໍ່ຈຳກັດ",
  "Unlimited Staff": "ພະນັກງານບໍ່ຈຳກັດ",
  "Unlimited Items": "ລາຍການບໍ່ຈຳກັດ",
  "Unlimited Orders / month": "ອໍເດີ/ເດືອນ ບໍ່ຈຳກັດ",

  "Sales Inquiries": "ສອບຖາມການຂາຍ",
  "Talk to our sales team about pricing and plans.": "ຄຸຍກັບທີມຂາຍກ່ຽວກັບລາຄາ ແລະ ແຜນ.",
  "Customer Support": "ຊ່ວຍເຫຼືອລູກຄ້າ",
  "Get help with setup, billing or technical issues.":
    "ຮັບຄວາມຊ່ວຍເຫຼືອເລື່ອງຕັ້ງຄ່າ, ບິນ ຫຼື ບັນຫາເຕັກນິກ.",
  "Speak with our team during business hours.": "ຄຸຍກັບທີມງານໃນເວລາເຮັດການ.",
  "Email Us": "ສົ່ງອີເມວຫາພວກເຮົາ",
  "Send us an email anytime and we will respond.":
    "ສົ່ງອີເມວຫາພວກເຮົາໄດ້ທຸກເວລາ ແລະ ພວກເຮົາຈະຕອບກັບ.",
  "Visit Our Office": "ຢ້ຽມຢາມສຳນັກງານ",
  "Meet us at our office in Vientiane, Laos.": "ພົບພວກເຮົາທີ່ສຳນັກງານໃນວຽງຈັນ, ລາວ.",
  "View on Map": "ເບິ່ງໃນແຜນທີ່",
  "Response within 2 hours": "ຕອບກັບພາຍໃນ 2 ຊົ່ວໂມງ",

  "Show orders and promotions to customers in real-time.":
    "ສະແດງອໍເດີ ແລະ ໂປຣໂມຊັນໃຫ້ລູກຄ້າແບບ real-time.",
  "Take orders on the go with mobile app.": "ຮັບອໍເດີຜ່ານແອັບມືຖືໄດ້ທຸກບ່ອນ.",
  "Digital menu for dine-in or takeaway.": "ເມນູດິຈິຕອນສຳລັບກິນທີ່ຮ້ານ ຫຼື ຊື້ກັບບ້ານ.",
  "Reward customers and boost retention.": "ໃຫ້ລາງວັນລູກຄ້າ ແລະ ເພີ່ມການກັບມາໃຊ້ຊ້ຳ.",
  "Deeper insights for better business decisions.":
    "ຂໍ້ມູນເຊິງລຶກເພື່ອການຕັດສິນໃຈທາງທຸລະກິດທີ່ດີຂຶ້ນ.",
  "Add your logo and create receipts your way.":
    "ເພີ່ມໂລໂກ້ ແລະ ອອກແບບໃບຮັບເງິນໃນແບບຂອງທ່ານ.",
  "Accept payments by bank transfer with ease.": "ຮັບຊຳລະເງິນຜ່ານໂອນທະນາຄານໄດ້ງ່າຍ.",
  "Advanced inventory tracking with batch and expiry.":
    "ຕິດຕາມສິນຄ້າຄົງຄັງຂັ້ນສູງພ້ອມ batch ແລະ ວັນໝົດອາຍຸ.",
  "Manage table and room reservations easily.": "ຈັດການການຈອງໂຕະ ແລະ ຫ້ອງໄດ້ງ່າຍ.",
  "Let customers book appointments online.": "ໃຫ້ລູກຄ້າຈອງນັດອອນລາຍ.",
  "Customer Display": "ຈໍລູກຄ້າ",
  "Staff Order Mobile": "ມືຖືສັ່ງອໍເດີພະນັກງານ",
  "QR Public Menu": "ເມນູ QR ສາທາລະນະ",
  "Receipt Customization": "ປັບແຕ່ງໃບຮັບເງິນ",
  "Bank Transfer Support": "ຮອງຮັບໂອນທະນາຄານ",
  "Multi-branch Expansion": "ຂະຫຍາຍຫຼາຍສາຂາ",
  "Inventory Plus": "ສິນຄ້າຄົງຄັງ Plus",
  "Reservation Module": "ໂມດູນຈອງ",
  "Appointment Booking": "ຈອງນັດໝາຍ",

  Product: "ຜະລິດຕະພັນ",
  Company: "ບໍລິສັດ",
  Support: "ຊ່ວຍເຫຼືອ",
  "About Us": "ກ່ຽວກັບພວກເຮົາ",
  Careers: "ອາຊີບ",
  Blog: "ບລັອກ",
  "User Guide": "ຄູ່ມືຜູ້ໃຊ້",
  "System Status": "ສະຖານະລະບົບ",
  "Request Support": "ຂໍການຊ່ວຍເຫຼືອ",
  "Contact Us": "ຕິດຕໍ່ພວກເຮົາ",
  "Secure & Certified": "ປອດໄພ ແລະ ໄດ້ຮັບການຮັບຮອງ",
  Compliant: "ປະຕິບັດຕາມມາດຕະຖານ",
  "TJ POS is a modern, cloud-based point-of-sale platform designed for businesses in Laos.":
    "TJ POS ແມ່ນແພລດຟອມຂາຍໜ້າຮ້ານຜ່ານຄລາວດ໌ທີ່ທັນສະໄໝ ອອກແບບສຳລັບທຸລະກິດໃນລາວ.",
  "(c) 2025 TJ POS Co., Ltd. All rights reserved.":
    "(c) 2025 TJ POS Co., Ltd. ສະຫງວນລິຂະສິດ.",
  "Terms of Service": "ເງື່ອນໄຂການໃຊ້ບໍລິການ",
  "Privacy Policy": "ນະໂຍບາຍຄວາມເປັນສ່ວນຕົວ"
};

type I18nContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (text: string) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      const stored = window.localStorage.getItem(STORAGE_KEY);

      if (stored === "lo" || stored === "en") {
        setLanguageState(stored);
      }
    });

    return () => window.cancelAnimationFrame(frameId);
  }, []);

  useEffect(() => {
    document.documentElement.lang = language === "lo" ? "lo" : "en";
    window.localStorage.setItem(STORAGE_KEY, language);
  }, [language]);

  const setLanguage = useCallback((nextLanguage: Language) => {
    setLanguageState(nextLanguage);
  }, []);

  const t = useCallback(
    (text: string) => {
      if (language === "en") {
        return text;
      }

      return lo[text] ?? text;
    },
    [language]
  );

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      t
    }),
    [language, setLanguage, t]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);

  if (!context) {
    throw new Error("useI18n must be used inside LanguageProvider");
  }

  return context;
}

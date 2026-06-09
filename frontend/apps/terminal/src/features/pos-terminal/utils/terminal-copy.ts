import type { OrderType, PosType } from "../types";

type TerminalCopy = {
  summaryTitle: string;
  infoTitle: string;
  primaryIdLabel: string;
  newRecordLabel: string;
  locationLabel: string;
  locationFallback: string;
  customerLabel: string;
  walkInLabel: string;
  noCustomerSelectedLabel: string;
  selectCustomerTitle: string;
  newCustomerLabel: string;
  cartTitle: string;
  cartEmptyTitle: string;
  cartEmptyDescription: string;
  currentDraftTitle: string;
  backToCartLabel: string;
  receiptEntityLabel: string;
  missingPaidRecordMessage: string;
  newPrimaryActionLabel: string;
  openRecordsLabel: string;
  heldRecordsLabel: string;
  searchRecordsPlaceholder: string;
  idHeading: string;
  locationHeading: string;
  emptyRecordsMessage: string;
  totalRecordsLabel: string;
  completedRecordsLabel: string;
  offlineDescription: string;
  queuedRecordsLabel: string;
  offlineQueueIds: string[];
  shiftOpeningDescription: string;
  startShiftActionLabel: string;
  shiftTotalLabel: string;
  debtRequiresCustomerMessage: string;
  addedToCartNotice: string;
  clearedCartNotice: string;
  startNewNotice: string;
  emptyHoldWarning: string;
  heldNotice: string;
  notFoundNotice: string;
  loadedNotice: string;
  emptyDiscountWarning: string;
  emptyPaymentWarning: string;
  debtSavedNotice: string;
  partialPaymentSavedNotice: string;
  paymentSuccessNotice: string;
};

const terminalCopyByPosType: Record<PosType, TerminalCopy> = {
  retail: {
    summaryTitle: "ສະຫຼຸບການຂາຍ",
    infoTitle: "ຂໍ້ມູນການຂາຍ",
    primaryIdLabel: "ເລກການຂາຍ",
    newRecordLabel: "ການຂາຍໃໝ່",
    locationLabel: "ເຄົາເຕີ",
    locationFallback: "ເຄົາເຕີ",
    customerLabel: "ລູກຄ້າ",
    walkInLabel: "ລູກຄ້າທົ່ວໄປ",
    noCustomerSelectedLabel: "ຍັງບໍ່ເລືອກສະມາຊິກ",
    selectCustomerTitle: "ເລືອກລູກຄ້າ",
    newCustomerLabel: "ລູກຄ້າໃໝ່",
    cartTitle: "ກະຕ່າ",
    cartEmptyTitle: "ຍັງບໍ່ມີສິນຄ້າໃນກະຕ່າ",
    cartEmptyDescription: "ເພີ່ມສິນຄ້າຈາກລາຍການເພື່ອເລີ່ມການຂາຍນີ້.",
    currentDraftTitle: "ການຂາຍປັດຈຸບັນ",
    backToCartLabel: "ກັບໄປກະຕ່າ",
    receiptEntityLabel: "ການຂາຍ",
    missingPaidRecordMessage: "ບໍ່ພົບການຂາຍທີ່ຊຳລະຫຼ້າສຸດ.",
    newPrimaryActionLabel: "ການຂາຍໃໝ່",
    openRecordsLabel: "ການຂາຍທີ່ເປີດຢູ່",
    heldRecordsLabel: "ການຂາຍທີ່ພັກໄວ້",
    searchRecordsPlaceholder: "ຄົ້ນຫາການຂາຍ, ລູກຄ້າ ຫຼື ບິນ",
    idHeading: "ການຂາຍ",
    locationHeading: "ເຄົາເຕີ / ປະເພດ",
    emptyRecordsMessage: "ບໍ່ມີການຂາຍທີ່ກົງກັບມຸມມອງນີ້.",
    totalRecordsLabel: "ການຂາຍ",
    completedRecordsLabel: "ການຂາຍທີ່ສຳເລັດ",
    offlineDescription: "ຍັງຂາຍໄດ້ໃນເຄື່ອງນີ້. ລະບົບຈະ sync ເມື່ອການເຊື່ອມຕໍ່ກັບມາ.",
    queuedRecordsLabel: "ການຂາຍລໍຖ້າ sync",
    offlineQueueIds: ["#RT-0108", "#RT-0107", "#RT-0106", "#RT-0105"],
    shiftOpeningDescription: "ປ້ອນເງິນຕົ້ນກະກ່ອນເລີ່ມຂາຍທີ່ POS ນີ້.",
    startShiftActionLabel: "ເລີ່ມຂາຍ",
    shiftTotalLabel: "ຍອດຂາຍລວມ",
    debtRequiresCustomerMessage: "ການຂາຍເປັນໜີ້ຕ້ອງເລືອກລູກຄ້າທີ່ມີເງື່ອນໄຂເຄຣດິດ.",
    addedToCartNotice: "ຖືກເພີ່ມເຂົ້າກະຕ່າແລ້ວ.",
    clearedCartNotice: "ລ້າງກະຕ່າແລ້ວ.",
    startNewNotice: "ພ້ອມເລີ່ມການຂາຍໃໝ່.",
    emptyHoldWarning: "ກະຕ່າຍັງວ່າງ. ເພີ່ມສິນຄ້າກ່ອນພັກການຂາຍນີ້.",
    heldNotice: "ຖືກພັກໄວ້ເພື່ອຊຳລະພາຍຫຼັງ.",
    notFoundNotice: "ບໍ່ພົບການຂາຍ.",
    loadedNotice: "ໂຫຼດກັບເຂົ້າກະຕ່າແລ້ວ.",
    emptyDiscountWarning: "ກະຕ່າຍັງວ່າງ. ເພີ່ມສິນຄ້າກ່ອນໃຊ້ສ່ວນຫຼຸດ.",
    emptyPaymentWarning: "ກະຕ່າຍັງວ່າງ. ເພີ່ມສິນຄ້າກ່ອນຊຳລະ.",
    debtSavedNotice: "ຖືກບັນທຶກເປັນໜີ້ລູກຄ້າ.",
    partialPaymentSavedNotice: "ບັນທຶກການຈ່າຍບາງສ່ວນແລ້ວ.",
    paymentSuccessNotice: "ຊຳລະສຳເລັດແລ້ວ."
  },
  cafe: {
    summaryTitle: "ສະຫຼຸບອໍເດີ",
    infoTitle: "ຂໍ້ມູນອໍເດີ",
    primaryIdLabel: "ເລກອໍເດີ",
    newRecordLabel: "ອໍເດີໃໝ່",
    locationLabel: "ໂຕະ",
    locationFallback: "ບໍ່ເລືອກໂຕະ",
    customerLabel: "ລູກຄ້າ",
    walkInLabel: "ລູກຄ້າທົ່ວໄປ",
    noCustomerSelectedLabel: "ຍັງບໍ່ເລືອກສະມາຊິກ",
    selectCustomerTitle: "ເລືອກລູກຄ້າ",
    newCustomerLabel: "ລູກຄ້າໃໝ່",
    cartTitle: "ອໍເດີປັດຈຸບັນ",
    cartEmptyTitle: "ອໍເດີຍັງວ່າງ",
    cartEmptyDescription: "ເພີ່ມເມນູເພື່ອເລີ່ມອໍເດີນີ້.",
    currentDraftTitle: "ອໍເດີປັດຈຸບັນ",
    backToCartLabel: "ກັບໄປອໍເດີ",
    receiptEntityLabel: "ອໍເດີ",
    missingPaidRecordMessage: "ບໍ່ພົບອໍເດີທີ່ຊຳລະຫຼ້າສຸດ.",
    newPrimaryActionLabel: "ອໍເດີໃໝ່",
    openRecordsLabel: "ອໍເດີເປີດຢູ່",
    heldRecordsLabel: "ອໍເດີພັກໄວ້",
    searchRecordsPlaceholder: "ຄົ້ນຫາອໍເດີ, ໂຕະ ຫຼື ລູກຄ້າ",
    idHeading: "ອໍເດີ",
    locationHeading: "ໂຕະ / ປະເພດ",
    emptyRecordsMessage: "ບໍ່ມີອໍເດີທີ່ກົງກັບມຸມມອງນີ້.",
    totalRecordsLabel: "ອໍເດີ",
    completedRecordsLabel: "ອໍເດີທີ່ສຳເລັດ",
    offlineDescription: "ຍັງຂາຍໄດ້ໃນເຄື່ອງນີ້. ລະບົບຈະ sync ເມື່ອການເຊື່ອມຕໍ່ກັບມາ.",
    queuedRecordsLabel: "ອໍເດີລໍຖ້າ sync",
    offlineQueueIds: ["#ORD-0061", "#ORD-0060", "#ORD-0059", "#ORD-0058"],
    shiftOpeningDescription: "ປ້ອນເງິນຕົ້ນກະກ່ອນເລີ່ມຂາຍທີ່ POS ນີ້.",
    startShiftActionLabel: "ເລີ່ມຂາຍ",
    shiftTotalLabel: "ຍອດຂາຍລວມ",
    debtRequiresCustomerMessage: "ການຂາຍເປັນໜີ້ຕ້ອງເລືອກລູກຄ້າທີ່ມີເງື່ອນໄຂເຄຣດິດ.",
    addedToCartNotice: "ຖືກເພີ່ມເຂົ້າອໍເດີແລ້ວ.",
    clearedCartNotice: "ລ້າງອໍເດີແລ້ວ.",
    startNewNotice: "ພ້ອມເລີ່ມອໍເດີໃໝ່.",
    emptyHoldWarning: "ອໍເດີຍັງວ່າງ. ເພີ່ມເມນູກ່ອນພັກອໍເດີນີ້.",
    heldNotice: "ຖືກພັກໄວ້ເພື່ອຊຳລະພາຍຫຼັງ.",
    notFoundNotice: "ບໍ່ພົບອໍເດີ.",
    loadedNotice: "ໂຫຼດກັບເຂົ້າອໍເດີແລ້ວ.",
    emptyDiscountWarning: "ອໍເດີຍັງວ່າງ. ເພີ່ມເມນູກ່ອນໃຊ້ສ່ວນຫຼຸດ.",
    emptyPaymentWarning: "ອໍເດີຍັງວ່າງ. ເພີ່ມເມນູກ່ອນຊຳລະ.",
    debtSavedNotice: "ຖືກບັນທຶກເປັນໜີ້ລູກຄ້າ.",
    partialPaymentSavedNotice: "ບັນທຶກການຈ່າຍບາງສ່ວນແລ້ວ.",
    paymentSuccessNotice: "ຊຳລະສຳເລັດແລ້ວ."
  },
  restaurant: {
    summaryTitle: "ສະຫຼຸບອໍເດີ",
    infoTitle: "ຂໍ້ມູນອໍເດີ",
    primaryIdLabel: "ເລກອໍເດີ",
    newRecordLabel: "ອໍເດີໃໝ່",
    locationLabel: "ໂຕະ",
    locationFallback: "ບໍ່ເລືອກໂຕະ",
    customerLabel: "ລູກຄ້າ",
    walkInLabel: "ລູກຄ້າທົ່ວໄປ",
    noCustomerSelectedLabel: "ຍັງບໍ່ເລືອກສະມາຊິກ",
    selectCustomerTitle: "ເລືອກລູກຄ້າ",
    newCustomerLabel: "ລູກຄ້າໃໝ່",
    cartTitle: "ອໍເດີປັດຈຸບັນ",
    cartEmptyTitle: "ອໍເດີຍັງວ່າງ",
    cartEmptyDescription: "ເພີ່ມເມນູເພື່ອເລີ່ມອໍເດີນີ້.",
    currentDraftTitle: "ອໍເດີປັດຈຸບັນ",
    backToCartLabel: "ກັບໄປອໍເດີ",
    receiptEntityLabel: "ອໍເດີ",
    missingPaidRecordMessage: "ບໍ່ພົບອໍເດີທີ່ຊຳລະຫຼ້າສຸດ.",
    newPrimaryActionLabel: "ອໍເດີໃໝ່",
    openRecordsLabel: "ອໍເດີເປີດຢູ່",
    heldRecordsLabel: "ອໍເດີພັກໄວ້",
    searchRecordsPlaceholder: "ຄົ້ນຫາອໍເດີ, ໂຕະ ຫຼື ລູກຄ້າ",
    idHeading: "ອໍເດີ",
    locationHeading: "ໂຕະ / ປະເພດ",
    emptyRecordsMessage: "ບໍ່ມີອໍເດີທີ່ກົງກັບມຸມມອງນີ້.",
    totalRecordsLabel: "ອໍເດີ",
    completedRecordsLabel: "ອໍເດີທີ່ສຳເລັດ",
    offlineDescription: "ຍັງຂາຍໄດ້ໃນເຄື່ອງນີ້. ລະບົບຈະ sync ເມື່ອການເຊື່ອມຕໍ່ກັບມາ.",
    queuedRecordsLabel: "ອໍເດີລໍຖ້າ sync",
    offlineQueueIds: ["#RS-0215", "#RS-0214", "#RS-0213", "#RS-0212"],
    shiftOpeningDescription: "ປ້ອນເງິນຕົ້ນກະກ່ອນເລີ່ມຂາຍທີ່ POS ນີ້.",
    startShiftActionLabel: "ເລີ່ມຂາຍ",
    shiftTotalLabel: "ຍອດຂາຍລວມ",
    debtRequiresCustomerMessage: "ການຂາຍເປັນໜີ້ຕ້ອງເລືອກລູກຄ້າທີ່ມີເງື່ອນໄຂເຄຣດິດ.",
    addedToCartNotice: "ຖືກເພີ່ມເຂົ້າອໍເດີແລ້ວ.",
    clearedCartNotice: "ລ້າງອໍເດີແລ້ວ.",
    startNewNotice: "ພ້ອມເລີ່ມອໍເດີໃໝ່.",
    emptyHoldWarning: "ອໍເດີຍັງວ່າງ. ເພີ່ມເມນູກ່ອນພັກອໍເດີນີ້.",
    heldNotice: "ຖືກພັກໄວ້ເພື່ອຊຳລະພາຍຫຼັງ.",
    notFoundNotice: "ບໍ່ພົບອໍເດີ.",
    loadedNotice: "ໂຫຼດກັບເຂົ້າອໍເດີແລ້ວ.",
    emptyDiscountWarning: "ອໍເດີຍັງວ່າງ. ເພີ່ມເມນູກ່ອນໃຊ້ສ່ວນຫຼຸດ.",
    emptyPaymentWarning: "ອໍເດີຍັງວ່າງ. ເພີ່ມເມນູກ່ອນຊຳລະ.",
    debtSavedNotice: "ຖືກບັນທຶກເປັນໜີ້ລູກຄ້າ.",
    partialPaymentSavedNotice: "ບັນທຶກການຈ່າຍບາງສ່ວນແລ້ວ.",
    paymentSuccessNotice: "ຊຳລະສຳເລັດແລ້ວ."
  },
  beauty: {
    summaryTitle: "ສະຫຼຸບບໍລິການ",
    infoTitle: "ຂໍ້ມູນບໍລິການ",
    primaryIdLabel: "ເລກບໍລິການ",
    newRecordLabel: "ບໍລິການໃໝ່",
    locationLabel: "ນັດໝາຍ",
    locationFallback: "ບໍ່ມີນັດໝາຍ",
    customerLabel: "ລູກຄ້າ",
    walkInLabel: "ລູກຄ້າທົ່ວໄປ",
    noCustomerSelectedLabel: "ຍັງບໍ່ເລືອກສະມາຊິກ",
    selectCustomerTitle: "ເລືອກລູກຄ້າ",
    newCustomerLabel: "ລູກຄ້າໃໝ່",
    cartTitle: "ລາຍການບໍລິການ",
    cartEmptyTitle: "ລາຍການບໍລິການຍັງວ່າງ",
    cartEmptyDescription: "ເພີ່ມບໍລິການເພື່ອເລີ່ມຊຳລະ.",
    currentDraftTitle: "ບໍລິການປັດຈຸບັນ",
    backToCartLabel: "ກັບໄປບໍລິການ",
    receiptEntityLabel: "ບໍລິການ",
    missingPaidRecordMessage: "ບໍ່ພົບບໍລິການທີ່ຊຳລະຫຼ້າສຸດ.",
    newPrimaryActionLabel: "ບໍລິການໃໝ່",
    openRecordsLabel: "ບໍລິການທີ່ກຳລັງເປີດ",
    heldRecordsLabel: "ບໍລິການທີ່ພັກໄວ້",
    searchRecordsPlaceholder: "ຄົ້ນຫາບໍລິການ, ນັດໝາຍ ຫຼື ລູກຄ້າ",
    idHeading: "ບໍລິການ",
    locationHeading: "ນັດໝາຍ / ປະເພດ",
    emptyRecordsMessage: "ບໍ່ມີບໍລິການທີ່ກົງກັບມຸມມອງນີ້.",
    totalRecordsLabel: "ບໍລິການ",
    completedRecordsLabel: "ບໍລິການທີ່ສຳເລັດ",
    offlineDescription: "ຍັງບັນທຶກບໍລິການໄດ້ໃນເຄື່ອງນີ້. ລະບົບຈະ sync ເມື່ອການເຊື່ອມຕໍ່ກັບມາ.",
    queuedRecordsLabel: "ບໍລິການລໍຖ້າ sync",
    offlineQueueIds: ["#BT-0041", "#BT-0040", "#BT-0039", "#BT-0038"],
    shiftOpeningDescription: "ປ້ອນເງິນຕົ້ນກະກ່ອນຊຳລະຄ່າບໍລິການທີ່ POS ນີ້.",
    startShiftActionLabel: "ເລີ່ມຊຳລະບໍລິການ",
    shiftTotalLabel: "ຍອດຂາຍບໍລິການລວມ",
    debtRequiresCustomerMessage: "ການຂາຍເປັນໜີ້ຕ້ອງເລືອກລູກຄ້າທີ່ມີເງື່ອນໄຂເຄຣດິດ.",
    addedToCartNotice: "ຖືກເພີ່ມເຂົ້າລາຍການບໍລິການແລ້ວ.",
    clearedCartNotice: "ລ້າງລາຍການບໍລິການແລ້ວ.",
    startNewNotice: "ພ້ອມເລີ່ມຊຳລະບໍລິການໃໝ່.",
    emptyHoldWarning: "ລາຍການບໍລິການຍັງວ່າງ. ເພີ່ມບໍລິການກ່ອນພັກການຊຳລະນີ້.",
    heldNotice: "ຖືກພັກໄວ້ເພື່ອຊຳລະພາຍຫຼັງ.",
    notFoundNotice: "ບໍ່ພົບບັນທຶກບໍລິການ.",
    loadedNotice: "ໂຫຼດກັບເຂົ້າລາຍການບໍລິການແລ້ວ.",
    emptyDiscountWarning: "ລາຍການບໍລິການຍັງວ່າງ. ເພີ່ມບໍລິການກ່ອນໃຊ້ສ່ວນຫຼຸດ.",
    emptyPaymentWarning: "ລາຍການບໍລິການຍັງວ່າງ. ເພີ່ມບໍລິການກ່ອນຊຳລະ.",
    debtSavedNotice: "ຖືກບັນທຶກເປັນໜີ້ລູກຄ້າ.",
    partialPaymentSavedNotice: "ບັນທຶກການຈ່າຍບາງສ່ວນແລ້ວ.",
    paymentSuccessNotice: "ຊຳລະສຳເລັດແລ້ວ."
  },
  hospitality: {
    summaryTitle: "ສະຫຼຸບບັນຊີແຂກ",
    infoTitle: "ຂໍ້ມູນບັນຊີແຂກ",
    primaryIdLabel: "ເລກບັນຊີແຂກ",
    newRecordLabel: "ບັນຊີແຂກໃໝ່",
    locationLabel: "ຫ້ອງ",
    locationFallback: "ບໍ່ເລືອກຫ້ອງ",
    customerLabel: "ແຂກ",
    walkInLabel: "ແຂກທົ່ວໄປ",
    noCustomerSelectedLabel: "ຍັງບໍ່ເລືອກແຂກ",
    selectCustomerTitle: "ເລືອກແຂກ",
    newCustomerLabel: "ແຂກໃໝ່",
    cartTitle: "ລາຍການບັນຊີແຂກ",
    cartEmptyTitle: "ບັນຊີແຂກຍັງວ່າງ",
    cartEmptyDescription: "ເພີ່ມຫ້ອງ ຫຼື ບໍລິການເພີ່ມເຂົ້າບັນຊີແຂກນີ້.",
    currentDraftTitle: "ບັນຊີແຂກປັດຈຸບັນ",
    backToCartLabel: "ກັບໄປບັນຊີແຂກ",
    receiptEntityLabel: "ບັນຊີແຂກ",
    missingPaidRecordMessage: "ບໍ່ພົບບັນຊີແຂກທີ່ຊຳລະຫຼ້າສຸດ.",
    newPrimaryActionLabel: "ບັນຊີແຂກໃໝ່",
    openRecordsLabel: "ບັນຊີແຂກທີ່ເປີດຢູ່",
    heldRecordsLabel: "ບັນຊີແຂກທີ່ພັກໄວ້",
    searchRecordsPlaceholder: "ຄົ້ນຫາຫ້ອງ, ແຂກ ຫຼື ບັນຊີແຂກ",
    idHeading: "ບັນຊີແຂກ",
    locationHeading: "ຫ້ອງ / ປະເພດ",
    emptyRecordsMessage: "ບໍ່ມີບັນຊີແຂກທີ່ກົງກັບມຸມມອງນີ້.",
    totalRecordsLabel: "ບັນຊີແຂກ",
    completedRecordsLabel: "ບັນຊີແຂກທີ່ສຳເລັດ",
    offlineDescription: "ຍັງອັບເດດຫ້ອງ ແລະ ບັນຊີແຂກໄດ້ໃນເຄື່ອງນີ້. ລະບົບຈະ sync ເມື່ອການເຊື່ອມຕໍ່ກັບມາ.",
    queuedRecordsLabel: "ບັນຊີແຂກລໍຖ້າ sync",
    offlineQueueIds: ["#HT-0092", "#HT-0091", "#HT-0090", "#HT-0089"],
    shiftOpeningDescription: "ປ້ອນເງິນຕົ້ນກະກ່ອນຊຳລະທີ່ໜ້າເຄົາເຕີ POS ນີ້.",
    startShiftActionLabel: "ເລີ່ມໜ້າເຄົາເຕີ",
    shiftTotalLabel: "ລາຍຮັບລວມ",
    debtRequiresCustomerMessage: "ການບັນທຶກໜີ້ຕ້ອງເລືອກແຂກທີ່ມີເງື່ອນໄຂເຄຣດິດ.",
    addedToCartNotice: "ຖືກເພີ່ມເຂົ້າບັນຊີແຂກແລ້ວ.",
    clearedCartNotice: "ລ້າງບັນຊີແຂກແລ້ວ.",
    startNewNotice: "ພ້ອມເລີ່ມບັນຊີແຂກໃໝ່.",
    emptyHoldWarning: "ບັນຊີແຂກຍັງວ່າງ. ເພີ່ມຫ້ອງ ຫຼື ບໍລິການເພີ່ມກ່ອນພັກບັນຊີນີ້.",
    heldNotice: "ຖືກພັກໄວ້ເພື່ອຊຳລະພາຍຫຼັງ.",
    notFoundNotice: "ບໍ່ພົບບັນຊີແຂກ.",
    loadedNotice: "ໂຫຼດກັບເຂົ້າບັນຊີແຂກແລ້ວ.",
    emptyDiscountWarning: "ບັນຊີແຂກຍັງວ່າງ. ເພີ່ມຫ້ອງ ຫຼື ບໍລິການເພີ່ມກ່ອນໃຊ້ສ່ວນຫຼຸດ.",
    emptyPaymentWarning: "ບັນຊີແຂກຍັງວ່າງ. ເພີ່ມຫ້ອງ ຫຼື ບໍລິການເພີ່ມກ່ອນຊຳລະ.",
    debtSavedNotice: "ຖືກບັນທຶກເປັນໜີ້ແຂກ.",
    partialPaymentSavedNotice: "ບັນທຶກການຈ່າຍບາງສ່ວນແລ້ວ.",
    paymentSuccessNotice: "ຊຳລະສຳເລັດແລ້ວ."
  }
};

export function getTerminalCopy(posType: PosType) {
  return terminalCopyByPosType[posType];
}

export function getTerminalLocationValue(
  posType: PosType,
  orderType: OrderType,
  selectedLocation: string | null
) {
  const copy = getTerminalCopy(posType);

  if (
    orderType === "ສັ່ງກັບບ້ານ" ||
    orderType === "ຂາຍປີກ" ||
    orderType === "ຂາຍສົ່ງ" ||
    orderType === "ຄືນສິນຄ້າ"
  ) {
    return "ເຄົາເຕີ";
  }

  return selectedLocation ?? copy.locationFallback;
}

export function getOrderLocationLabel(order: {
  posType?: PosType;
  roomId?: string | null;
  appointmentId?: string | null;
  table: string;
}) {
  if (order.posType === "hospitality" && order.roomId) {
    return `${"ຫ້ອງ"} ${order.roomId}`;
  }

  if (order.posType === "beauty" && order.appointmentId) {
    return `${"ນັດໝາຍ"} ${order.appointmentId}`;
  }

  return order.table;
}

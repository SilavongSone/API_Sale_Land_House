
// models/index.ts
import District from "./District";
import Province from "./Province";
import Project from "./Project";
import Zone from "./Zone";
import Expense from "./Expense";
import LandPlot from "./LandPlot";
import House from "./House";
import Sale from "./Sale";
import Customer from "./Customer";
import Staff from "./Staff";
import Currency from "./Currency";
import Payment from "./Payment";

// Import association initializers
import { initAssociations as initDistrictAssociations } from "./District";
import { initAssociations as initProjectAssociations } from "./Project";
import { initAssociations as initZoneAssociations } from "./Zone";
import { initAssociations as initExpenseAssociations } from "./Expense";
import { initAssociations as initProvinceAssociations } from "./Province";
import { initAssociations as initCurrencyAssociations } from "./Currency";
import { initAssociations as initLandPlotAssociations } from "./LandPlot";
import { initAssociations as initHouseAssociations } from "./House";
import { initAssociations as initStaffAssociations  } from "./Staff";
import { initAssociations as initCustomerAssociations } from "./Customer";
import { initAssociations as initSaleAssociations } from "./Sale";
import { initAssociations as initPaymentAssociations } from "./Payment";

// Initialize all associations after all models are loaded
export function initAllAssociations() {
  initDistrictAssociations();
  initProjectAssociations();
  initZoneAssociations();
  initExpenseAssociations();
  initProvinceAssociations();
  initCurrencyAssociations();
  initLandPlotAssociations();
  initHouseAssociations();
  initStaffAssociations();
  initCustomerAssociations();
  initSaleAssociations();
  initPaymentAssociations();

  // Add other association initializers here
}

export {
  District,
  Province,
  Project,
  Zone,
  Expense,
  LandPlot,
  House,
  Sale,
  Customer,
  Staff,
  Currency,

};
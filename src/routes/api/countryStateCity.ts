import { Router } from "express";

import {
  RequestParamsValidator,
  RequestQueryValidator,
} from "../../app/http/middleware/RequestValidator";
import { CountryProvinceCityRequest } from "../../app/http/requests/CommonRequest";
import { CountriesProvincesCitiesController } from "../../app/http/controllers/api/Common/CommonController";
import { IdQueryRequest } from "../../app/http/requests/IdQueryRequest";

const router = Router();

router.get(
  "/countries",
  RequestQueryValidator(CountryProvinceCityRequest),
  CountriesProvincesCitiesController.countries
);

router.get(
  "/provinces/:id",
  RequestParamsValidator(IdQueryRequest),
  RequestQueryValidator(CountryProvinceCityRequest),

  CountriesProvincesCitiesController.provinces
);

router.get(
  "/cities/:id",
  RequestQueryValidator(CountryProvinceCityRequest),
  RequestParamsValidator(IdQueryRequest),
  CountriesProvincesCitiesController.cities
);

export default router;

import { PrismaClient } from "@prisma/client";
import countries from "../storage/data/countries.json";
import provinces from "../storage/data/provinces.json";
import cities from "../storage/data/cities.json";
import dbConnection from "../app/providers/db";

const prisma = new PrismaClient();
async function seed() {
  await prisma.$connect();
  const CountryData: any = countries;
  console.log("starting seeding countries,provinces,cities");
  const countriesInput = [];

  for (const country of CountryData) {
    const provinceData: any = provinces.filter(
      (x) => x?.country_id == country?.id
    );
    const provincesCreateMany = [];

    for (const province of provinceData) {
      const citiesArray: any = cities;
      const CitiesData: any = citiesArray.filter(
        (x: { country_id: any; state_id: any }) =>
          x?.country_id == country?.id && x?.state_id == province?.id
      );

      const cityCreateMany = [];
      for (let city of CitiesData) {
        const cityObject = {
          name: city?.name || "",
          latitude: String(city?.latitude) || "",
          longitude: String(city?.longitude) || "",
        };
        cityCreateMany.push(cityObject);
      }

      const provinceObject = {
        name: province?.name || "",
        provinceCode: province?.state_code || "",
        type: province?.type || "",
        latitude: String(province?.latitude) || "",
        longitude: String(province?.longitude) || "",
        cities: cityCreateMany,
      };
      provincesCreateMany.push(provinceObject);
    }

    const data = {
      name: String(country?.name) || "",
      iso3: String(country?.iso3) || "",
      iso2: String(country?.iso2) || "",
      numericCode: String(country?.numeric_code) || "",
      phoneCode: String(country?.phone_code) || "",
      capital: String(country?.capital) || "" || "",
      currency: String(country?.currency) || "",
      currencyName: String(country?.currency_name) || "",
      currencySymbol: String(country?.currency_symbol) || "",
      native: String(country?.native) || "",
      region: String(country?.region) || "",
      subregion: String(country?.subregion) || "",
      latitude: String(country?.latitude) || "",
      longitude: String(country?.longitude) || "",
      provinces: provincesCreateMany,
    };

    countriesInput.push(data);
  }

  const countriesWithoutProvinces = countriesInput.map(
    ({
      name,
      iso3,
      iso2,
      numericCode,
      phoneCode,
      capital,
      currency,
      currencyName,
      currencySymbol,
      native,
      region,
      subregion,
      latitude,
      longitude,
    }) => {
      return {
        name,
        iso3,
        iso2,
        numericCode,
        phoneCode,
        capital,
        currency,
        currencyName,
        currencySymbol,
        native,
        region,
        subregion,
        latitude,
        longitude,
      };
    }
  );

  const [seededCountries] = await dbConnection.$transaction([
    prisma.country.createMany({
      data: countriesWithoutProvinces,
    }),
  ]);

  console.log(`seeded countries added: ${seededCountries}`);

  for (const countriesInputData of countriesInput) {
    const countryFind = await prisma.country.findFirst({
      where: {
        iso2: countriesInputData.iso2,
      },
    });

    if (countryFind) {
      const provinceArray = countriesInputData.provinces;
      if (provinceArray.length > 0) {
        const provinces = provinceArray.map(
          ({ name, latitude, longitude, provinceCode, type }) => {
            return {
              name,
              latitude,
              longitude,
              provinceCode,
              countryId: countryFind.id,
            };
          }
        );

        const [provincesLength] = await prisma.$transaction([
          prisma.province.createMany({
            data: provinces,
          }),
        ]);

        console.log(
          `seeding provinces for country ${countryFind.name} results added: ${provincesLength.count}`
        );

        for (const province of countriesInputData.provinces) {
          const cities = province.cities;
          if (cities.length > 0) {
            const findProvince = await prisma.province.findFirst({
              where: {
                countryId: countryFind.id,
                provinceCode: province.provinceCode,
              },
            });

            if (findProvince) {
              const citiesToAdd = cities.map((city) => {
                return {
                  ...city,
                  provinceId: findProvince.id,
                };
              });

              const [countCity] = await dbConnection.$transaction([
                prisma.city.createMany({
                  data: citiesToAdd,
                }),
              ]);

              console.log(
                `seeded cities for province ${findProvince.name} and country ${countryFind.name}  results added: ${countCity.count}`
              );
            }
          }
        }
      }
    }
  }
}

seed()
  .then(async () => {
    console.log("seeding completed");
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

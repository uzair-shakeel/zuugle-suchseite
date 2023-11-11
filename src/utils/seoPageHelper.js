import * as React from "react";
import Box from "@mui/material/Box";
import { Grid, Typography } from "@mui/material";
// import {Helmet} from "react-helmet";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { t } from "i18next";
// import { useTranslation } from "react-i18next";

export const getPageHeader = (directLink) => {
  // console.log("L8 directLink: ", JSON.stringify(directLink));
  
  if (!!directLink && !!directLink.header) {
    // console.log("L11 directLink.header: ", JSON.stringify(directLink.header));
    return (
      <HelmetProvider>
        <Helmet>
          <title>{directLink.header}</title>
          <meta name="og:title" content={directLink.header} />
          <meta name="og:description" content={directLink.description} />
        </Helmet>
      </HelmetProvider>
    );
  } else {
    return (
      <HelmetProvider>
        <Helmet>
          {/* <title>start.helmet_title</title> */}
          <title>Zuugle</title>
          <meta
            name="title"
            content="Zuugle - die Suchmaschine für Öffi-Bergtouren"
          />
          <meta
            name="description"
            content="Zuugle zeigt dir geprüfte Verbindungen mit Bahn und Bus zu Bergtouren, Wanderungen, Skitouren, Schneeschuhwanderungen, etc. von deinem Wohnort aus an."
          />
        </Helmet>
      </HelmetProvider>
    );
  }
};

// TODO : legacy code
// export const extractCityFromLocation = (location) => {
//   if (!!location && !!location.search) {
//     const searchParams = new URLSearchParams(location.search);
//     const cityParam = searchParams.get("city");
//     return cityParam;
//   }
//   return null; // Return null if the city parameter is not found in the search
// };

export const extractCityFromLocation = (location, cities) => {
  //searching for the case: "/cityslug" in location.pathname, in that case we check if it is a valid city, 
  if (!!location && location.pathname.startsWith('/')) {
    const pathSegments = location.pathname.split('/').filter(segment => !!segment);
    
    if (pathSegments.length === 1 && pathSegments[0] === 'suche') {
      if (!!location && !!location.search) {
        const searchParams = new URLSearchParams(location.search);
        const cityParam = searchParams.get("city");
        return cityParam;
      }
    } else if (pathSegments.length === 1) {
      const citySlug = pathSegments[0];

      // Check if citySlug exists in the cities array
      const matchingCity = cities.find(city => city.value === citySlug);
      
      if (matchingCity) {
        
        return matchingCity.value; // Set the city parameter to the label of the matching city
      }
    }
  }
  
  return null; // Return null if city param is not search or if the path doesn't match the pattern
};

export const getCityLabel = (location, cities) => {
  let citySlug = !!location ? extractCityFromLocation(location, cities) : null;
  if(!!cities && cities.length > 0){
    const found = cities.find(
      (city) => city.value == citySlug
    );
    if (!!found && !!found.label) {
      return found.label
      }else return "" ;
    }else{
      return "";
    }
}

export const checkIfSeoPageCity = (location, cities) => {
  console.log("L62 location: ", JSON.stringify(location)); // L62 {"pathname":"/amstetten","search":"?city=wien","hash":"","state":null,"key":"nslk04ae"}

  let citySlug = extractCityFromLocation(location,cities); // this is the city extrtcted from city param and not from location.pathname
  //console.log("L65 citySlug: ", JSON.stringify(citySlug)); // L63 citySlug:  "wien"
 
  if (!!location && !!location.pathname && location.pathname == "/suche") {
    return null;
  } else if (!!location && !!location.pathname && cities.length > 0) {
    const found = cities.find(
      (city) => city.value == citySlug
    );
    return found;
  } else {
    return null;
  }
};

//description
//This function, listAllCityLinks, takes in an array of cities and an optional searchParams object. It then maps over the array of cities and generates links for each city with appropriate URL parameters. Finally, it returns a JSX element containing a grid of city links wrapped in a Box with a Typography element for the title. If the cities argument is falsy, it returns an empty array.
export const listAllCityLinks = (cities, searchParams = null) => {
  //   const { t } = useTranslation();

  const country = translatedCountry();// currently not displayed due to re-redering issues arrising from i18next translations

  if (!!cities) {
    const entries = cities.map((city, index) => {
      // console.log("L99 city: ", JSON.stringify(city));
      let link = `${city.value}`;
      if (!!searchParams && !!searchParams.get("p")) { // redundant if we do not use provider anymore
        link = `${link}?p=${searchParams.get("p")}`;
      }
      return (
        <Grid key={index} item xs={12} sm={6} md={4}>
          <a href={`/${link}`} className={"seo-city-link"}>
            {city.label}
          </a>
        </Grid>
      );
    });
    return (
      <Box sx={{ textAlign: "left" }}>
        <Typography variant={"h4"} sx={{ marginBottom: "20px" }}>
          <>{country}</>
        </Typography>
        <Grid container>{entries}</Grid>
      </Box>
    );
  }
};

// export const listAllRangeLinks = (ranges, searchParams = null) => {
//   //   const { t } = useTranslation();
//   const country = translatedCountry();

//   if (!!ranges) {
//     const entries = ranges.map((range, index) => {
//       let city = "";
//       let link = `${range.range}`;
//       if (link == "null") {
//         return [];
//       }
//       link = parseRangeToUrl(link);
//       if (!!searchParams && !!searchParams.get("p")) {
//         link = `${link}?p=${searchParams.get("p")}`;
//       }
//       if (!!searchParams && !!searchParams.get("city")) {
//         city = searchParams.get("city");
//       }
//       return (
//         <Grid key={index} item xs={12} sm={6} md={4}>
//           <a
//             href={`/suche?range=${link}${!!city ? "&city=" + city : ""}`}
//             className={"seo-city-link"}
//           >
//             {range.range}
//           </a>
//         </Grid>
//       );
//     });

//     return (
//       <Box sx={{ textAlign: "left" }}>
//         <Typography variant={"h4"} sx={{ marginBottom: "20px" }}>
//           {/* <> country </> */}
//         </Typography>
//         <Grid container>{entries}</Grid>
//       </Box>
//     );
//   }
//   return [];
// };

const translatedCountry = () => {
    // const { t } = useTranslation();
  let country = getCountryName();
  // const countryKey = getCountryKey(country);

  country = getTranslatedCountry(country);
  // return t(`start.${countryKey}`);
  //try to pass the countryKey to the translation function in utils/translation.js
  return country;
};

export const getTranslatedCountry = (name) => {
  switch (name) {
    case "Schweiz":
      return t("start.schweiz");
    case "Österreich":
      return t("start.oesterreich");
    case "Deutschland":
      return t("start.deutschland");
    case "Frankreich":
      return t("start.frankreich");
    case "Slowenien":
      return t("start.slowenien");
    case "Italien":
      return t("start.italien");
    default:
      return t("start.oesterreich");
  }
};

export const getCountryKey = (name) => {
  switch (name) {
    case "Schweiz":
      return "schweiz";
    case "Österreich":
      return "oesterreich";
    case "Deutschland":
      return "deutschland";
    case "Frankreich":
      return "frankreich";
    case "Slowenien":
      return "slowenien";
    case "Italien":
      return "italien";
    default:
      return "oesterreich";
  }
};

export const getCountryName = () => {
  let host = window.location.host;
  // let host = "www2.zuugle.fr";

  if (host.indexOf("zuugle.ch") >= 0) {
    return "Schweiz";
  } else if (host.indexOf("zuugle.de") >= 0) {
    return "Deutschland";
  } else if (host.indexOf("zuugle.it") >= 0) {
    return "Italien";
  } else if (host.indexOf("zuugle.fr") >= 0) {
    return "Frankreich";
  } else if (host.indexOf("zuugle.si") >= 0) {
    return "Slowenien";
  } else {
    return "Österreich";
  }
};

export const getTranslatedCountryName = () => {
  let host = window.location.host;

  if (host.indexOf("zuugle.ch") >= 0) {
    return "start.schweiz";
  } else if (host.indexOf("zuugle.de") >= 0) {
    return "start.deutschland";
  } else if (host.indexOf("zuugle.it") >= 0) {
    return "start.italien";
  } else if (host.indexOf("zuugle.fr") >= 0) {
    return "start.frankreich";
  } else if (host.indexOf("zuugle.si") >= 0) {
    return "start.slowenien";
  } else {
    return "start.oesterreich";
  }
};


const parseRangeFromUrl = (text) => {
  return decodeURI(text);
};

const parseRangeToUrl = (text) => {
  return encodeURI(text);
};

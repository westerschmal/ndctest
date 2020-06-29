import logger from "./dfp/log";
import defineAds from "./dfp/define-ads";
import displayAds from "./dfp/display-ads";
import startPubads from "./dfp/start-pubads";
import setupPrebidAdUnits from "./prebid/setup-prebid-ad-units";
import prebidHandleAdServer from "./prebid/prebid-handle-ad-server";
import potentialAdTracking from "./dfp/potential-ad-tracking";
import generateTargeting from "./generate-targeting";

export default (adConfiguration) => {

  window.googletag = window.googletag || {};
  window.googletag.cmd = window.googletag.cmd || [];

  generateTargeting(adConfiguration);

  //Step 1: Define DFP Ads
  window.googletag.cmd.push(() => {
    window.dfpAdUnits = defineAds(adConfiguration);
    logger("GPT - Step #1: Defined DFP Ads", window.dfpAdUnits);
  });

  //Step 2: Start pubds
  window.googletag.cmd.push(() => {
    startPubads(adConfiguration);
    logger("GPT - Step #2: Started Pubads");
  });

  if (adConfiguration.headerBidding.active) {
    //Set config to high price granularity
/*    window.pbjs.setConfig({ priceGranularity: "high" });
    const prebidTimeout = 700;*/
    window.googletag.cmd.push(function () {
      window.googletag.pubads().disableInitialLoad();
      logger("GPT - Step #3: Disabled initial load");
    });

    window.Adhese.defineAdUnits(adConfiguration); //might want to check if Adhese object exists

/*    const prebidAdUnits = setupPrebidAdUnits(adConfiguration);
    window.pbjs = window.pbjs || {};
    window.pbjs.que = window.pbjs.que || [];

    window.pbjs.que.push(function () {
      window.pbjs.addAdUnits(prebidAdUnits);
      window.pbjs.requestBids({
        bidsBackHandler: prebidHandleAdServer
      });
      logger("PBJS - Step #1: Add Adunits and request bids");
    });

    setTimeout(() => {
      prebidHandleAdServer(true);
    }, prebidTimeout);*/
  } else {
    window.googletag.cmd.push(() => {
      displayAds(adConfiguration);
      potentialAdTracking();
      logger("Display ads");
    });
  }
};

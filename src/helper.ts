const { createApolloFetch } = require("apollo-fetch");

export const fetchEpodServer = createApolloFetch({
  uri: "http://localhost:4000/graphql",
});

export const completeReportShipment = (
  shipmentNumber: Array<String>,
  deliveries: any
) => {
  return shipmentNumber.map((s) => {
    let completeCount = 0;
    let pendingCount = 0;
    deliveries
      .filter((x: any) => x.shipmentNumber === s)
      .map((d: any) => {
        if (d.delvStatus === "Complete") {
          completeCount = completeCount + 1;
        } else {
          pendingCount = pendingCount + 1;
        }
      });
    return {
      shipment: s,
      completed: completeCount,
      pending: pendingCount,
    };
  });
};

export const varianceReportShipment = (
  shipmentNumber: Array<String>,
  deliveries: any
) => {
  return shipmentNumber.map((shipment) => {
    return deliveries
      .filter((del: any) => del.shipmentNumber === shipment)
      .map((del: any) => {
        if (del.delvStatus === "Complete") {
          let variance = 0;
          del.items.map((item: any) => {
            const convertVariance = (variance: number) => {
              if (variance < 0) {
                return variance * -1;
              }
              return variance;
            };
            const qty = item.qty;
            const varianceQty = convertVariance(item.varianceQty) || 0;
            variance = variance + (varianceQty / qty) * 100;
          });
          variance = variance != 0 ? variance / del.items.length : 0;
          return {
            delivery: del.id,
            variance: variance,
            shipment: shipment,
          };
        }
      });
  });
};

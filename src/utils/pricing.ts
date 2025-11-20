export interface PricingSummary {
  amount: number;
  rate: number;
  realPricePerDay: number;
  depositAmount: number;
  fee: number;
}

export const calculateAmountToBePaidByUser = (
  pricePerDay: number,
  totalDays: number
): PricingSummary => {
  const normalizedDays = Math.max(1, totalDays);
  const realPricePerDay = pricePerDay / 1.1;
  const baseAmount = realPricePerDay * normalizedDays;

  let amountAfterPercentage = baseAmount;
  let depositAmount = baseAmount;
  let rate = 1;

  if (normalizedDays >= 2 && normalizedDays <= 5) {
    amountAfterPercentage = baseAmount + (baseAmount * 5) / 100;
    depositAmount = amountAfterPercentage - (baseAmount * 5) / 100;
    rate = 5;
  } else if (normalizedDays >= 6 && normalizedDays <= 10) {
    amountAfterPercentage = baseAmount + (baseAmount * 4) / 100;
    depositAmount = amountAfterPercentage - (baseAmount * 4) / 100;
    rate = 4;
  } else if (normalizedDays > 10) {
    amountAfterPercentage = baseAmount + (baseAmount * 2) / 100;
    depositAmount = amountAfterPercentage - (baseAmount * 2) / 100;
    rate = 2;
  }else if (totalDays === 1) {
    amountAfterPercentage = pricePerDay;
    depositAmount = amountAfterPercentage;
    rate = 10;
  } 
  else {
    amountAfterPercentage = baseAmount;
    depositAmount = amountAfterPercentage - (baseAmount * 1) / 100;
    rate = 1;
  }

  const fee = amountAfterPercentage - baseAmount;
  console.log('amountAfterPercentage', amountAfterPercentage);
  console.log('baseAmount', baseAmount);
  console.log('fee', fee);
  console.log('depositAmount', depositAmount);
  console.log('rate', rate);
  console.log('realPricePerDay', realPricePerDay);
  console.log('pricePerDay', pricePerDay);
  console.log('totalDays', totalDays);
  console.log('normalizedDays', normalizedDays);
  return {
    amount: Number(amountAfterPercentage.toFixed(2)),
    rate,
    realPricePerDay: Number(realPricePerDay.toFixed(2)),
    depositAmount: Number(depositAmount.toFixed(2)),
    fee: Number(fee.toFixed(2)),
  };
};


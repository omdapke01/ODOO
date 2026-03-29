const prisma = require("../config/prisma");
const { exchangeRateApiKey } = require("../config/env");

async function convertToBaseCurrency({ amount, currency, companyId }) {
  const company = await prisma.company.findUnique({
    where: { id: companyId },
    select: { baseCurrency: true },
  });

  if (!company) {
    throw new Error("Company not found.");
  }

  if (company.baseCurrency === currency) {
    return {
      baseCurrency: company.baseCurrency,
      convertedAmount: Number(amount),
      rate: 1,
    };
  }

  if (!exchangeRateApiKey) {
    return {
      baseCurrency: company.baseCurrency,
      convertedAmount: Number(amount),
      rate: 1,
      note: "Exchange API key missing. Stored original amount as fallback.",
    };
  }

  const response = await fetch(`https://v6.exchangerate-api.com/v6/${exchangeRateApiKey}/latest/${currency}`);

  if (!response.ok) {
    throw new Error("Currency conversion failed.");
  }

  const data = await response.json();
  const rate = data?.conversion_rates?.[company.baseCurrency];

  if (!rate) {
    throw new Error("Base currency conversion rate not found.");
  }

  return {
    baseCurrency: company.baseCurrency,
    convertedAmount: Number((Number(amount) * rate).toFixed(2)),
    rate,
  };
}

module.exports = { convertToBaseCurrency };

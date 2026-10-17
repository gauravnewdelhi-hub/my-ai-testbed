const patterns = {
  home: {
    schedule: "This is a demo only. Please use the site's inquiry form to explore the flow; it does not create a booking or dispatch.",
    emergency: "If there is immediate danger, contact your local emergency services. This demonstration cannot dispatch a technician or handle a real emergency.",
    heat: "For a real heating issue, turn off equipment if you notice smoke or a burning smell, and contact a qualified local professional. This demo cannot diagnose equipment."
  },
  shop: {
    shipping: "These are fictional demo products. Example shipping is 3–5 business days, with free shipping over $50. No order is placed.",
    return: "Demo purchases are not real transactions. In a real store, check the seller's published return terms before ordering.",
    cart: "The cart is stored only in this browser session. There is no payment or checkout service."
  },
  legal: {
    legal: "This is general information about a fictional firm, not legal advice or a lawyer-client relationship. Please do not share confidential or identifying details.",
    consultation: "The consultation form is only a local demonstration and is not sent to a law firm. Do not submit real or sensitive information.",
    practice: "The fictional firm demonstrates family, small-business, and estate-planning practice pages. A qualified attorney can advise on a real matter."
  },
  general: {
    fallback: "I can help with general information about this demo. Try asking about services, products, shipping, practice areas, privacy, or how the simulation works."
  }
};

export function simulateReply(agentId, input, previousMessages = []) {
  const message = typeof input === "string" ? input.trim().slice(0, 1000) : "";
  if (!message) return "Please enter a question.";
  const text = message.toLowerCase();
  if (/legal-intake/.test(agentId)) {
    if (/lawyer|legal|advice|case|court|confidential|attorney/.test(text)) return patterns.legal.legal;
    if (/consult|contact|appointment|call/.test(text)) return patterns.legal.consultation;
    if (/practice|service|area/.test(text)) return patterns.legal.practice;
  } else if (/shopping-assistant/.test(agentId)) {
    if (/ship|deliver|arriv/.test(text)) return patterns.shop.shipping;
    if (/return|refund|exchange/.test(text)) return patterns.shop.return;
    if (/cart|checkout|pay|payment|order/.test(text)) return patterns.shop.cart;
  } else if (/home-services-assistant/.test(agentId)) {
    if (/emergency|urgent|danger|smell gas|smoke/.test(text)) return patterns.home.emergency;
    if (/heat|heating|furnace|cold/.test(text)) return patterns.home.heat;
    if (/schedule|appointment|book|service|repair/.test(text)) return patterns.home.schedule;
  }
  if (/^(hi|hello|hey)\b/.test(text)) return "Hello! What would you like to know about this demonstration?";
  if (/\b(thank|thanks)\b/.test(text)) return "You're welcome. Remember, this is a simulated demonstration and does not contact a real service.";
  if (previousMessages.length > 1) return "I can keep helping with general demo questions. I don't retain or send your conversation anywhere; try a question about the site's services or how the demo works.";
  return patterns.general.fallback;
}

export const simulationRuntime = Object.freeze({
  kind: "simulation",
  respond({ agentId, input, history = [] }) {
    return simulateReply(agentId, input, history);
  }
});

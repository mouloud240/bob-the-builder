const fs = require('fs');

const elements = [
  {"type":"cameraUpdate","width":1200,"height":900,"x":0,"y":-50},
  
  // Title
  {"type":"text","id":"t_title","x":400,"y":-30,"text":"Food Donation Platform - Use Case Diagram","fontSize":24,"strokeColor":"#1e1e1e"},
  
  // System Boundary
  {"type":"rectangle","id":"sys","x":250,"y":30,"width":650,"height":820,"backgroundColor":"transparent","fillStyle":"solid","strokeColor":"#b0b0b0","strokeWidth":2,"strokeStyle":"dashed"},
  {"type":"text","id":"sysTitle","x":270,"y":40,"text":"System Functions","fontSize":20,"strokeColor":"#757575"},
  
  // Actors
  {"type":"rectangle","id":"a_donor","x":50,"y":200,"width":120,"height":60,"roundness":{"type":3},"backgroundColor":"#a5d8ff","fillStyle":"solid","label":{"text":"Donor","fontSize":16},"strokeColor":"#4a9eed"},
  {"type":"rectangle","id":"a_bene","x":50,"y":550,"width":120,"height":60,"roundness":{"type":3},"backgroundColor":"#a5d8ff","fillStyle":"solid","label":{"text":"Beneficiary","fontSize":16},"strokeColor":"#4a9eed"},
  
  {"type":"rectangle","id":"a_admin","x":980,"y":120,"width":160,"height":60,"roundness":{"type":3},"backgroundColor":"#a5d8ff","fillStyle":"solid","label":{"text":"Administrator","fontSize":16},"strokeColor":"#4a9eed"},
  {"type":"rectangle","id":"a_saver","x":980,"y":400,"width":160,"height":60,"roundness":{"type":3},"backgroundColor":"#a5d8ff","fillStyle":"solid","label":{"text":"Food Saver","fontSize":16},"strokeColor":"#4a9eed"},
  {"type":"rectangle","id":"a_auth","x":980,"y":650,"width":160,"height":60,"roundness":{"type":3},"backgroundColor":"#a5d8ff","fillStyle":"solid","label":{"text":"Local Authority","fontSize":16},"strokeColor":"#4a9eed"},

  // Use Cases
  {"type":"ellipse","id":"uc_auth","x":480,"y":80,"width":150,"height":60,"backgroundColor":"#d3f9d8","fillStyle":"solid","label":{"text":"Register / Login","fontSize":16},"strokeColor":"#22c55e"},
  
  {"type":"ellipse","id":"uc_pub","x":300,"y":180,"width":160,"height":60,"backgroundColor":"#d3f9d8","fillStyle":"solid","label":{"text":"Publish Donation","fontSize":16},"strokeColor":"#22c55e"},
  {"type":"ellipse","id":"uc_conf","x":350,"y":280,"width":180,"height":60,"backgroundColor":"#d3f9d8","fillStyle":"solid","label":{"text":"Confirm Reservation","fontSize":16},"strokeColor":"#22c55e"},
  
  {"type":"ellipse","id":"uc_chat","x":480,"y":380,"width":180,"height":60,"backgroundColor":"#fff3bf","fillStyle":"solid","label":{"text":"Chat & Coordinate","fontSize":16},"strokeColor":"#f59e0b"},
  
  {"type":"ellipse","id":"uc_res","x":300,"y":480,"width":180,"height":60,"backgroundColor":"#d3f9d8","fillStyle":"solid","label":{"text":"Reserve Donation","fontSize":16},"strokeColor":"#22c55e"},
  {"type":"ellipse","id":"uc_search","x":300,"y":580,"width":160,"height":60,"backgroundColor":"#d3f9d8","fillStyle":"solid","label":{"text":"Search & Filter","fontSize":16},"strokeColor":"#22c55e"},
  
  {"type":"ellipse","id":"uc_rep","x":480,"y":680,"width":160,"height":60,"backgroundColor":"#ffc9c9","fillStyle":"solid","label":{"text":"Report Issues","fontSize":16},"strokeColor":"#ef4444"},
  
  {"type":"ellipse","id":"uc_badges","x":480,"y":770,"width":160,"height":60,"backgroundColor":"#d0bfff","fillStyle":"solid","label":{"text":"Earn Badges","fontSize":16},"strokeColor":"#8b5cf6"},

  {"type":"ellipse","id":"uc_roles","x":650,"y":180,"width":180,"height":60,"backgroundColor":"#eebefa","fillStyle":"solid","label":{"text":"Manage Roles","fontSize":16},"strokeColor":"#ec4899"},
  {"type":"ellipse","id":"uc_mod","x":680,"y":280,"width":180,"height":60,"backgroundColor":"#ffc9c9","fillStyle":"solid","label":{"text":"Moderate Chat","fontSize":16},"strokeColor":"#ef4444"},
  
  {"type":"ellipse","id":"uc_val","x":680,"y":400,"width":180,"height":60,"backgroundColor":"#c3fae8","fillStyle":"solid","label":{"text":"Validate Users","fontSize":16},"strokeColor":"#22c55e"},
  
  {"type":"ellipse","id":"uc_dash","x":680,"y":650,"width":180,"height":60,"backgroundColor":"#ffd8a8","fillStyle":"solid","label":{"text":"View Dashboards","fontSize":16},"strokeColor":"#f59e0b"},
];

const arrows = [
  // Donor
  ["a_donor", "uc_auth"], ["a_donor", "uc_pub"], ["a_donor", "uc_conf"], ["a_donor", "uc_chat"], ["a_donor", "uc_rep"], ["a_donor", "uc_badges"],
  // Beneficiary
  ["a_bene", "uc_auth"], ["a_bene", "uc_search"], ["a_bene", "uc_res"], ["a_bene", "uc_chat"], ["a_bene", "uc_rep"], ["a_bene", "uc_badges"],
  // Administrator
  ["a_admin", "uc_auth"], ["a_admin", "uc_roles"], ["a_admin", "uc_dash"], ["a_admin", "uc_mod"],
  // Food Saver
  ["a_saver", "uc_auth"], ["a_saver", "uc_val"], ["a_saver", "uc_badges"],
  // Local Authority
  ["a_auth", "uc_dash"]
];

let k = 1;
arrows.forEach(([from, to]) => {
  elements.push({
    "type": "arrow",
    "id": `arr_${k++}`,
    "x": 0, "y": 0, "width": 0, "height": 0, "points": [[0,0],[0,0]], // Let Excalidraw bindings auto-route
    "strokeColor": "#1e1e1e",
    "strokeWidth": 1,
    "startBinding": { "elementId": from, "fixedPoint": null }, // null means find closest point
    "endBinding": { "elementId": to, "fixedPoint": null },
    "endArrowhead": "arrow"
  });
});

console.log(JSON.stringify(elements));

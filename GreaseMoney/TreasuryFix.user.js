// This file is formatted for use with this add-on: https://addons.mozilla.org/en-US/firefox/addon/greasemonkey/
// ==UserScript==
// @name     TreasuryFix
// @version  1.01
// @grant    none
// @include        https://www.treasurydirect.gov/RS/*
// ==/UserScript==

for (let e of document.getElementsByClassName("pwordinput")) { e.removeAttribute('readonly'); }

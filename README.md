# TreasuryFix

US Treasury Series I Bonds pay an inflation adjusted rate + a fixed rate of interest. As of 1/1/2022, the inflation adjusted rate of interest is 7.12%. 
There is a purchase limit of $10,000 per SSN per year through TreasuryDirect.gov. 

Many people (myself included) think this is a pretty good deal and like to buy i-bonds. Unfortunately, TreasuryDirect.gov is one of the worst websites known to man. It is very painful to use and has a number of terrible design/UX decisions from like 2003 that will make you angry every time you encounter them. 

That's why this project exists. TreasuryFix is a client-side javascript tool that will just make the experience of using Treasury Direct a lot less painful for you. 

Here's one of my favorite (most-hated) features of the Treasury Direct website: the mandatory On-Screen-Keyboard. 

TreasuryFix makes using this silly keyboard OPTIONAL instead of REQUIRED. So you can copy/paste in your password or use a password manager to auto-fill it. Yes, that's right. TreasuryDirect doesn't let you type in your own password by default... It is terrible. 

![The On-Screen-Keyboard](https://github.com/neuralnexus/TreasuryFix/blob/main/assets/OSK.jpg?raw=true)

# Security

There is no additional security risk from running this. No traffic is sent to my servers or any servers that you were not communicating with before. Your password is not being logged by this. The code is not complicated and is as simple as I can make it; you can examine it and understand what it does with very little effort. There can be security risks from running other user scripts via the extensions linked below. Be careful running scripts you find on the internet. 

# Legal

This code runs in your computer browser and only affects sessions opened from your system to the treasury direct site. Use it at your own risk; I don't offer any warranties or support. 

# Installation

For Firefox users: 
1. Install GreaseMonkey: https://addons.mozilla.org/en-US/firefox/addon/greasemonkey/ 
2. Select ![import a backup](https://github.com/neuralnexus/TreasuryFix/blob/main/assets/gm_import.png?raw=true)
3. Upload the backup file. 

For Chrome (or Chromium-based) users:
1. Install TaperMonkey: https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo?hl=en
2. Select ![Create a new script](https://github.com/neuralnexus/TreasuryFix/blob/main/assets/tpm_new.png?raw=true)
3. Paste the script in the TaperMonkey directory there. Then save. 

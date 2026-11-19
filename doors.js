const entrance = document.querySelector("#entrance");
const invitation = document.querySelector("#invitation");
const openButton = document.querySelector("#open");
entrance.hidden = false;
invitation.inert = true;
document.body.classList.add("locked");
openButton.focus({ preventScroll: true });

openButton.addEventListener("click", () => {
  entrance.classList.add("opening");
  const finish = () => {
    entrance.hidden = true;
    invitation.inert = false;
    document.body.classList.remove("locked");
    document.querySelector("h1").focus({ preventScroll: true });
  };
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) finish();
  else setTimeout(finish, 900);
}, { once: true });

if (location.protocol === "https:" || location.protocol === "http:") {
  const invitationUrl = new URL(location.pathname, location.origin).href;
  const shareSection = document.querySelector("#share");
  const nativeShare = document.querySelector("#share-link");
  const copyLink = document.querySelector("#copy-link");
  const status = document.querySelector("#share-status");
  const manualLink = document.querySelector("#manual-link");
  const message = "నామకరణ వేడుకకు ఆహ్వానం";
  document.querySelector("#whatsapp").href =
    "https://wa.me/?text=" + encodeURIComponent(message + "\n" + invitationUrl);
  shareSection.hidden = false;
  nativeShare.hidden = !navigator.share;
  nativeShare.addEventListener("click", async () => {
    try {
      await navigator.share({ title: message, url: invitationUrl });
    } catch (error) {
      if (error.name !== "AbortError") status.textContent = "లింక్‌ను కాపీ చేయండి / WhatsAppలో పంచుకోండి";
    }
  });
  copyLink.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(invitationUrl);
      status.textContent = "లింక్ కాపీ అయింది.";
    } catch {
      manualLink.value = invitationUrl;
      manualLink.hidden = false;
      manualLink.focus();
      manualLink.select();
      status.textContent = "లింక్‌ను కాపీ చేయండి";
    }
  });
}

const countdown = document.querySelector("#countdown");
const ceremony = document.querySelector("#marriage time");
const ceremonyStart = Date.parse(ceremony.dateTime);

if (Number.isFinite(ceremonyStart)) {
  const values = [...countdown.querySelectorAll("[data-unit]")];
  const status = document.querySelector("#countdown-status");

  function updateCountdown() {
    const remaining = Math.max(0, Math.ceil((ceremonyStart - Date.now()) / 1000));
    const parts = [
      Math.floor(remaining / 86400),
      Math.floor(remaining / 3600) % 24,
      Math.floor(remaining / 60) % 60,
      remaining % 60
    ];
    values.forEach((value, index) => {
      value.textContent = String(parts[index]).padStart(2, "0");
    });
    if (remaining === 0) status.textContent = "వేడుక సమయం వచ్చింది.";
    return remaining > 0;
  }

  countdown.hidden = false;
  if (updateCountdown()) {
    const timer = setInterval(() => {
      if (!updateCountdown()) clearInterval(timer);
    }, 1000);
  }
}

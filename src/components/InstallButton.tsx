import { useEffect, useState } from "react";
import { DownloadCloud } from "lucide-react";
import { motion } from "framer-motion";

export default function InstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setVisible(true);
    };
    window.addEventListener("beforeinstallprompt", handler as any);
    return () => window.removeEventListener("beforeinstallprompt", handler as any);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const choiceResult = await deferredPrompt.userChoice;
    console.log("User choice:", choiceResult.outcome);
    setDeferredPrompt(null);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <motion.div
      onClick={handleInstall}
      style={{
        position: "fixed",
        bottom: 25,
        right: 15,
        zIndex: 1000,
        cursor: "pointer",
        borderRadius: "50%",
        background: "#1DB95460",
        padding: 16,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 1px 2px rgba(255,255,255,.9)",
      }}
      animate={{ y: [0, -8, 0] }} // subtle floating
      transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
      whileHover={{ scale: 1.15, boxShadow: "0 10px 20px rgba(0,0,0,0.25)" }}
    >
      <DownloadCloud size={28} color="white" />
    </motion.div>
  );
}

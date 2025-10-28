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
      className="
        fixed bottom-6 right-4 z-50
        flex items-center justify-center
        w-14 h-14 rounded-full
        bg-gradient-to-r from-primary/70 to-primary/60
        shadow-lg
        cursor-pointer
        hover:scale-110 hover:shadow-2xl
      "
      animate={{ y: [0, -8, 0] }} // subtle floating
      transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
    >
      <DownloadCloud size={28} color="white" />
    </motion.div>
  );
}

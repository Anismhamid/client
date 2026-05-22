import { Box, Typography, useTheme } from "@mui/material";
import { motion } from "framer-motion";

interface SafqaLogoProps {
  animated?: boolean;
  variant?: "full" | "icon" | "minimal";
  
}

// Logo Component with Interactive Elements
const SafqaLogo2 = ({ variant = "full" }: SafqaLogoProps) => {
  const theme = useTheme();
  
  const logos = {
    full: (
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <motion.div
          whileHover={{ rotate: [0, -5, 5, -5, 0] }}
          transition={{ duration: 0.5 }}
        >
          <img src="/logo-icon.svg" alt="Safqa" style={{ height: 40 }} />
        </motion.div>
        
        <Box>
          <Box sx={{ display: "flex", alignItems: "baseline", gap: 0.5 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 800,
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                color: "transparent",
              }}
            >
              صفقة
            </Typography>
            <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 500 }}>
              SAFQA
            </Typography>
            <Typography variant="caption" sx={{ color: "text.disabled" }}>
              ספקה
            </Typography>
          </Box>
          <Typography variant="caption" sx={{ color: "text.disabled", fontSize: "0.65rem" }}>
            سوق إلكتروني موثوق
          </Typography>
        </Box>
      </Box>
    ),
    
    icon: (
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        style={{ cursor: "pointer" }}
      >
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: 2,
            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography sx={{ color: "white", fontWeight: 800, fontSize: 20 }}>
            ص
          </Typography>
        </Box>
      </motion.div>
    ),
    
    minimal: (
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
        <Box
          sx={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            bgcolor: "primary.main",
          }}
        />
        <Typography
          variant="h6"
          sx={{
            fontWeight: 800,
            fontSize: "1.1rem",
            color: "text.primary",
          }}
        >
          صفقة
        </Typography>
        <Typography
          variant="caption"
          sx={{
            fontWeight: 600,
            color: "primary.main",
            letterSpacing: 1,
          }}
        >
          SAFQA
        </Typography>
      </Box>
    ),
  };
  
  return logos[variant] || logos.full;
};

export default SafqaLogo2;
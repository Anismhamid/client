import { FunctionComponent } from "react";
import {
    Modal,
    Box,
    IconButton,
    Typography,
    Paper,
    Fade,
    useTheme,
    useMediaQuery,
    alpha,
} from "@mui/material";
import { Close as CloseIcon, AddCircleOutline } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import handleRTL from "../../../locales/handleRTL";
import PostForm from "./PostForm";
import useAddProductFormik from "../../../hooks/useAddProductFormik";

interface AddProductModalProps {
    show: boolean;
    onHide: () => void;
}

const AddProductModal: FunctionComponent<AddProductModalProps> = ({ show, onHide }) => {
    const { t } = useTranslation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const dir = handleRTL();

    const { formik, imageFile, setImageFile, imageData, setImageData } =
        useAddProductFormik(onHide);

    return (
        <Modal
            dir={dir}
            open={show}
            onClose={onHide}
            closeAfterTransition
            slotProps={{
                backdrop: {
                    timeout: 300,
                    sx: {
                        backgroundColor: alpha(theme.palette.common.black, 0.85),
                        backdropFilter: "blur(8px)",
                    },
                },
            }}
            sx={{
                display: "flex",
                alignItems: isMobile ? "flex-end" : "center",
                justifyContent: "center",
                zIndex: 2000,
            }}
        >
            <Fade in={show} timeout={300}>
                <Paper
                    elevation={0}
                    sx={{
                        position: "relative",
                        width: "100%",
                        maxWidth: isMobile
                            ? "100%"
                            : {
                                    xs: "95%",
                                    sm: "90%",
                                    md: "800px",
                                    lg: "900px",
                                },
                        maxHeight: isMobile ? "92vh" : "90vh",
                        borderRadius: isMobile ? "28px 28px 0 0" : "28px",
                        overflow: "hidden",
                        background: theme.palette.mode === "dark"
                            ? `linear-gradient(145deg, ${alpha(theme.palette.background.paper, 0.98)}, ${alpha(theme.palette.grey[900], 0.98)})`
                            : `linear-gradient(145deg, ${theme.palette.background.paper}, ${alpha(theme.palette.grey[50], 0.98)})`,
                        backdropFilter: "blur(10px)",
                        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                        boxShadow: isMobile
                            ? `0 -20px 40px -12px ${alpha(theme.palette.common.black, 0.3)}`
                            : `0 30px 60px -20px ${alpha(theme.palette.common.black, 0.4)}`,
                    }}
                >
                    {/* Animated gradient top bar */}
                    <Box
                        sx={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            height: "3px",
                            background: `linear-gradient(90deg, 
                                ${theme.palette.primary.main}, 
                                ${theme.palette.secondary.main}, 
                                ${theme.palette.primary.main})`,
                            backgroundSize: "200% 100%",
                            animation: "gradientMove 2s ease infinite",
                            "@keyframes gradientMove": {
                                "0%": { backgroundPosition: "0% 50%" },
                                "50%": { backgroundPosition: "100% 50%" },
                                "100%": { backgroundPosition: "0% 50%" },
                            },
                        }}
                    />

                    {/* Swipe indicator for mobile */}
                    {isMobile && (
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                                pt: 1.5,
                                pb: 0.5,
                            }}
                        >
                            <Box
                                sx={{
                                    width: 50,
                                    height: 4,
                                    borderRadius: 2,
                                    backgroundColor: alpha(theme.palette.text.disabled, 0.4),
                                }}
                            />
                        </Box>
                    )}

                    {/* Header */}
                    <Box
                        sx={{
                            position: "sticky",
                            top: 0,
                            zIndex: 20,
                            px: isMobile ? 2.5 : { xs: 3, sm: 4 },
                            py: isMobile ? 2 : 3,
                            background: theme.palette.mode === "dark"
                                ? alpha(theme.palette.background.paper, 0.95)
                                : alpha(theme.palette.background.paper, 0.95),
                            backdropFilter: "blur(20px)",
                            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                        }}
                    >
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                                <motion.div
                                    whileHover={{ rotate: 5, scale: 1.05 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <Box
                                        sx={{
                                            width: 44,
                                            height: 44,
                                            borderRadius: "16px",
                                            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            boxShadow: `0 8px 20px ${alpha(theme.palette.primary.main, 0.3)}`,
                                        }}
                                    >
                                        <AddCircleOutline sx={{ color: "white", fontSize: 24 }} />
                                    </Box>
                                </motion.div>

                                <Box>
                                    <Typography
                                        variant="h5"
                                        sx={{
                                            fontWeight: 800,
                                            fontSize: isMobile ? "1.3rem" : "1.6rem",
                                            letterSpacing: "-0.5px",
                                            background: `linear-gradient(135deg, ${theme.palette.text.primary}, ${theme.palette.primary.main})`,
                                            backgroundClip: "text",
                                            WebkitBackgroundClip: "text",
                                            color: "transparent",
                                        }}
                                    >
                                        {t("modals.addProductModal.title") || "إضافة منتج جديد"}
                                    </Typography>
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            color: alpha(theme.palette.text.secondary, 0.8),
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 0.5,
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                width: 6,
                                                height: 6,
                                                borderRadius: "50%",
                                                bgcolor: theme.palette.success.main,
                                            }}
                                        />
                                        {t("modals.addProductModal.subtitle") || "املأ المعلومات التالية لنشر منتجك"}
                                    </Typography>
                                </Box>
                            </Box>

                            <IconButton
                                onClick={onHide}
                                sx={{
                                    color: theme.palette.text.secondary,
                                    backgroundColor: alpha(theme.palette.action.hover, 0.5),
                                    "&:hover": {
                                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                                        color: theme.palette.primary.main,
                                        transform: "rotate(90deg)",
                                    },
                                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                    width: 40,
                                    height: 40,
                                }}
                            >
                                <CloseIcon />
                            </IconButton>
                        </Box>
                    </Box>

                    {/* Body */}
                    <Box
                        sx={{
                            p: isMobile ? 2.5 : { xs: 3, sm: 4 },
                            maxHeight: isMobile ? "calc(92vh - 120px)" : "calc(90vh - 130px)",
                            overflowY: "auto",
                            WebkitOverflowScrolling: "touch",
                            "&::-webkit-scrollbar": {
                                width: 6,
                            },
                            "&::-webkit-scrollbar-track": {
                                background: alpha(theme.palette.divider, 0.1),
                                borderRadius: 3,
                            },
                            "&::-webkit-scrollbar-thumb": {
                                background: alpha(theme.palette.primary.main, 0.4),
                                borderRadius: 3,
                                "&:hover": {
                                    background: alpha(theme.palette.primary.main, 0.6),
                                },
                            },
                        }}
                    >
                        {/* Form Container with subtle background */}
                        <Box
                            sx={{
                                background: theme.palette.mode === "dark"
                                    ? alpha(theme.palette.common.white, 0.02)
                                    : alpha(theme.palette.common.black, 0.01),
                                borderRadius: "20px",
                                p: isMobile ? 1.5 : { xs: 2, sm: 2.5 },
                                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                            }}
                        >
                            <PostForm
                                formik={formik}
                                imageFile={imageFile}
                                setImageFile={setImageFile}
                                imageData={imageData}
                                setImageData={setImageData}
                                onHide={onHide}
                                mode='add'
                            />
                        </Box>

                        {/* Footer Note */}
                        <Typography
                            variant="caption"
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: 1,
                                mt: 3,
                                pt: 2,
                                borderTop: `1px dashed ${alpha(theme.palette.divider, 0.5)}`,
                                color: alpha(theme.palette.text.secondary, 0.7),
                                textAlign: "center",
                            }}
                        >
                            <Box
                                sx={{
                                    width: 4,
                                    height: 4,
                                    borderRadius: "50%",
                                    bgcolor: theme.palette.primary.main,
                                }}
                            />
                            {t("modals.addProductModal.footerNote") || "جميع الحقول المميزة بـ * مطلوبة"}
                            <Box
                                sx={{
                                    width: 4,
                                    height: 4,
                                    borderRadius: "50%",
                                    bgcolor: theme.palette.primary.main,
                                }}
                            />
                        </Typography>
                    </Box>
                </Paper>
            </Fade>
        </Modal>
    );
};

export default AddProductModal;
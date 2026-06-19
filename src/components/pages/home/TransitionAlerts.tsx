import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import CloseIcon from '@mui/icons-material/Close';
import { AlertHeading } from 'react-bootstrap';
import { useEffect, useState } from 'react';

function TransitionAlerts() {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const time = setTimeout(() => {
            setOpen(true);

            const audio = new Audio('/perfect-ding-1-355745.mp3');
            audio.volume = 0.5;

            audio.play().catch(() => {
                // Browser blocked autoplay
                console.log('Autoplay blocked');
            });
        }, 3000);

        return () => clearTimeout(time);
    }, []);

    return (
        <Box sx={{ width: '100%', position: 'fixed', zIndex: 11 }}>
            <Collapse in={open}>
                <Alert
                    severity='warning'
                    sx={{ m: 3, mb: 0 }}
                    action={
                        <IconButton
                            color='inherit'
                            size='small'
                            onClick={() => setOpen(false)}
                        >
                            <CloseIcon fontSize='inherit' />
                        </IconButton>
                    }
                >
                    <AlertHeading>تنبيه</AlertHeading>
                    الموقع لا يزال قيد التطوير، وقد تظهر بعض الأخطاء أو المشاكل
                    البسيطة أو قد تكون بعض الميزات غير مكتملة. إذا واجهت أي
                    مشكلة، نرجو إبلاغنا فورًا، وسنعمل على إصلاحها بأسرع وقت
                    ممكن. شكرًا لتفهمكم ودعمكم.
                </Alert>
            </Collapse>
        </Box>
    );
}

export default TransitionAlerts;

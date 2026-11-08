import { FunctionComponent } from 'react';
import { Box, Button, Card, Stack, Typography, alpha } from '@mui/material';
import { CheckCircle, RadioButtonUnchecked, TaskAlt } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { MissingField, getCompletionColor, SectionHeader, DISPLAY_FONT, Meter, ALL_FIELDS, SUCCESS } from './ProfileShared';


interface CompletionCardProps {
    completion: number;
    missing: MissingField[];
    onComplete: () => void;
}

const CompletionCard: FunctionComponent<CompletionCardProps> = ({
    completion,
    missing,
    onComplete,
}) => {
    const { t } = useTranslation();
    const color = getCompletionColor(completion);

    const copy: Record<MissingField, { label: string; hint: string }> = {
        photo: {
            label: t('profile.field.photo', { defaultValue: 'صورة شخصية' }),
            hint: t('profile.field.photoHint', {
                defaultValue: 'المشترون يثقون أكثر بالبائع الذي يعرض صورته.',
            }),
        },
        name: {
            label: t('profile.field.name', { defaultValue: 'الاسم الكامل' }),
            hint: t('profile.field.nameHint', {
                defaultValue: 'أضف الاسم الأول واسم العائلة.',
            }),
        },
        phone: {
            label: t('profile.field.phone', { defaultValue: 'رقم الهاتف' }),
            hint: t('profile.field.phoneHint', {
                defaultValue: 'ليتمكن المشترون من التواصل معك.',
            }),
        },
        address: {
            label: t('profile.field.address', { defaultValue: 'العنوان' }),
            hint: t('profile.field.addressHint', {
                defaultValue: 'المدينة والشارع ورقم البيت.',
            }),
        },
        gender: {
            label: t('profile.field.gender', { defaultValue: 'الجنس' }),
            hint: t('profile.field.genderHint', {
                defaultValue: 'اختر من القائمة في تعديل البيانات.',
            }),
        },
    };

    return (
        <Card
            variant='outlined'
            sx={{
                borderRadius: 3,
                overflow: 'hidden',
                borderColor: alpha(color, 0.4),
                bgcolor: alpha(color, 0.04),
            }}
        >
            <SectionHeader
                icon={<TaskAlt />}
                title={t('profile.completeYourProfile', {
                    defaultValue: 'أكمل ملفك الشخصي',
                })}
            />
            <Box sx={{ p: 3 }}>
                <Stack direction='row' alignItems='baseline' gap={1} sx={{ mb: 1.5 }}>
                    <Typography
                        component='p'
                        sx={{
                            fontFamily: DISPLAY_FONT,
                            fontWeight: 800,
                            fontSize: '2.25rem',
                            lineHeight: 1,
                            color,
                            fontVariantNumeric: 'tabular-nums',
                        }}
                    >
                        {completion}%
                    </Typography>
                    <Typography variant='body2' color='text.secondary'>
                        {t('profile.completed')}
                    </Typography>
                </Stack>
                <Meter value={completion} color={color} height={8} />

                <Stack spacing={1.5} sx={{ mt: 2.5 }}>
                    {ALL_FIELDS.map((field) => {
                        const isMissing = missing.includes(field);
                        return (
                            <Stack key={field} direction='row' gap={1.25} alignItems='flex-start'>
                                {isMissing ? (
                                    <RadioButtonUnchecked
                                        sx={{ fontSize: 20, mt: '1px', color: 'text.disabled' }}
                                    />
                                ) : (
                                    <CheckCircle
                                        sx={{ fontSize: 20, mt: '1px', color: SUCCESS }}
                                    />
                                )}
                                <Box>
                                    <Typography
                                        variant='body2'
                                        fontWeight={isMissing ? 700 : 500}
                                        color={isMissing ? 'text.primary' : 'text.secondary'}
                                    >
                                        {copy[field].label}
                                    </Typography>
                                    {isMissing && (
                                        <Typography variant='caption' color='text.secondary'>
                                            {copy[field].hint}
                                        </Typography>
                                    )}
                                </Box>
                            </Stack>
                        );
                    })}
                </Stack>

                <Button
                    fullWidth
                    variant='contained'
                    onClick={onComplete}
                    sx={{
                        mt: 3,
                        borderRadius: 999,
                        py: 1.1,
                        fontWeight: 800,
                        boxShadow: 'none',
                    }}
                >
                    {t('profile.completeNow', { defaultValue: 'أكمل بياناتي' })}
                </Button>
            </Box>
        </Card>
    );
};

export default CompletionCard;
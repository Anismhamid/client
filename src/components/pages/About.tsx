import {FunctionComponent} from "react";
import ArrowForwardIcon from "@mui/icons-material/ArrowForwardIos";
import {IconButton} from "@mui/material";
import {useNavigate} from "react-router-dom";

const About: FunctionComponent = () => {
	const navigate = useNavigate();

	return (
		<main className='min-vh-100'>
			<IconButton onClick={() => navigate(-1)} aria-label='back'>
				<ArrowForwardIcon />
			</IconButton>

			<div className='container py-5'>
				<div className='row justify-content-center'>
					<div className='col-md-8 text-center'>
						{/* Header */}
						<h1 className='mb-4 display-1 fw-bold'>אודותינו</h1>

						<p className='lead fs-3 mb-5'>
							ספקה היא פלטפורמה דיגיטלית לקנייה ומכירה בין המשתמשים, בצורה
							פשוטה, ישירה וללא מתווכים.
						</p>

						<section className='about-section'>
							<h3 className='my-4'>מה זה ספקה?</h3>
							<hr />
							<p className='lead'>
								ספקה מאפשרת לכל אחד למכור מוצרים שהוא כבר לא צריך, ולכל
								אחד אחר למצוא בדיוק את מה שהוא מחפש – בקלות, במהירות
								ובמחיר הוגן.
							</p>
						</section>

						<section className='about-section'>
							<h3 className='my-4'>קנייה ומכירה בין אנשים</h3>
							<hr />
							<p className='lead'>
								הפלטפורמה מבוססת על מודל C2C – אנשים מוכרים לאנשים. אנחנו
								לא חנות, לא ספק ולא גורם מסחרי – רק המקום שמחבר ביניכם.
							</p>
						</section>

						<section className='about-section'>
							<h3 className='my-4'>מה אפשר למצוא כאן?</h3>
							<hr />
							<p className='lead'>
								מוצרי יד שנייה וחדשים: אלקטרוניקה, לבית, אופנה, אביזרים,
								ציוד, ועוד – הכול ממשתמשים אמיתיים.
							</p>
						</section>

						<section className='about-section'>
							<h3 className='my-4'>שליטה מלאה למשתמש</h3>
							<hr />
							<p className='lead'>
								כל משתמש קובע מה הוא מוכר, באיזה מחיר, ואיך מתבצע הקשר עם
								הקונה. אין התחייבויות, ואין אותיות קטנות.
							</p>
						</section>

						<section className='about-section'>
							<h3 className='my-4'>אמון ושקיפות</h3>
							<hr />
							<p className='lead'>
								אנו פועלים ליצירת סביבה בטוחה וברורה, עם כלים לדיווח,
								ניהול תוכן, והדגשת שקיפות בין הצדדים.
							</p>
						</section>

						<section className='about-section'>
							<h3 className='my-4'>למה להצטרף?</h3>
							<hr />
							<p className='lead'>
								אם יש לך משהו למכור – ספקה היא הבמה שלך. אם אתה מחפש עסקה
								טובה – כאן תמצא אותה. ההרשמה פשוטה, והשימוש קל.
							</p>
						</section>

						<section className='about-section'>
							<h3 className='my-4'>קהילה מקומית</h3>
							<hr />
							<p className='lead'>
								ספקה מאפשרת חיפוש לפי אזור, כדי להפוך את העסקה למהירה,
								נוחה וקרובה אליך.
							</p>
						</section>
					</div>
				</div>
			</div>
		</main>
	);
};

export default About;

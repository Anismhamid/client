import {FunctionComponent} from "react";
import {Link} from "react-router-dom";
import {path} from "../routes/routes";

interface TermOfUseProps {}

const TermOfUse: FunctionComponent<TermOfUseProps> = () => {
	return (
		<main className='min-vh-100 py-5 px-3'>
			<div className='container border border-primary shadow p-5 rounded-4'>
				<h1 className='text-center my-5 text-primary'>תנאי שימוש</h1>
				<p className='text-center mb-5'>
					עודכן לאחרונה: <strong>15/04/2025</strong>
				</p>

				<section className='my-5'>
					<h2 className='display-6'>1. זכאות</h2>
					<p className='lead'>
						עליך להיות בן 18 לפחות (או בגיל הבגרות החוקי באזורך) כדי להשתמש
						בפלטפורמה. בשימושך בפלטפורמה, הנך מצהיר ומתחייב כי אתה עומד
						בדרישות אלו.
					</p>
				</section>

				<section className='my-5'>
					<h2 className='display-6'>2. הרשמה לחשבון</h2>
					<p className='lead'>
						ייתכן שתידרש ליצור חשבון כדי להשתמש בתכונות מסוימות. אתה אחראי
						לספק מידע מדויק ולעדכנו, וכן לשמור על סודיות הסיסמה שלך. אנו
						שומרים לעצמנו את הזכות להשעות או למחוק חשבון במקרה של פעילות חשודה
						או הפרת{" "}
						<Link
							to={path.PrivacyAndPolicy}
							className='ms-1 text-decoration-underline text-primary'
						>
							מדיניות הפרטיות
						</Link>
						.
					</p>
				</section>

				<section className='my-5'>
					<h2 className='display-6'>3. מוצרים והזמנות</h2>
					<p className='lead'>
						המחירים, הזמינות והתיאורים של המוצרים עשויים להשתנות בכל עת. הגשת
						הזמנה אינה מבטיחה את קבלתה, ואנו רשאים לדחות או לבטל הזמנות לפי
						שיקול דעתנו.
					</p>
				</section>

				<section className='mb-5'>
					<h2 className='display-6'>4. תשלומים</h2>
					<p className='lead'>
						אנו מקבלים שיטות תשלום מגוונות, לרבות כרטיסי אשראי, מזומן בעת
						אספקה ואחרות. בהזנת פרטי תשלום, הנך מצהיר כי אתה מורשה להשתמש
						בשיטה זו וכי הפרטים שסיפקת נכונים.
					</p>
				</section>

				<section className='mb-5'>
					<h2 className='display-6'>5. משלוחים ואיסוף</h2>
					<p className='lead'>
						הזמנים לאספקה ואיסוף הם הערכות בלבד ואינם מובטחים. ייתכנו עיכובים
						שאינם בשליטתנו. הלקוח רשאי לבחור בין משלוח לבין איסוף עצמי, בהתאם
						לזמינות.
					</p>
				</section>

				<section className='mb-5'>
					<h2 className='display-6'>6. החזרות והחזרים</h2>
					<p className='lead'>
						אנא עיין במדיניות ההחזרות וההחזרים שלנו לפרטים מלאים בנוגע לתנאים,
						מועדים וזכאות.
					</p>
				</section>

				<section className='mb-5'>
					<h2 className='display-6'>7. התנהגות משתמשים</h2>
					<ul className='lead'>
						<li>אין להשתמש בפלטפורמה לצרכים לא חוקיים.</li>
						<li>אין להתחזות לאחר או למסור מידע כוזב.</li>
						<li>אין להעלות קוד זדוני או לפגוע בפעילות הפלטפורמה.</li>
						<li>אין לנסות לגשת למערכות שאינך מורשה להן.</li>
					</ul>
					<p className='lead'>
						הפרת תנאים אלו עלולה להוביל לחסימה או לתביעה משפטית.
					</p>
				</section>

				<section className='mb-5'>
					<h2 className='display-6'>8. קניין רוחני</h2>
					<p className='lead'>
						כל התכנים, הסמלים, הלוגואים והתוכנה שייכים ל-Corner Market או
						למורשיה. אין להעתיק, לשכפל או לשלב תכנים אלה ללא רשות בכתב.
					</p>
				</section>

				<section className='mb-5'>
					<h2 className='display-6'>9. עדכונים בזמן אמת</h2>
					<p className='lead'>
						אנו משתמשים בטכנולוגיות מתקדמות לצורך עדכונים בזמן אמת, כולל סטטוס
						הזמנה, הודעות אדמין והתראות הנחות. בשימושך בפלטפורמה, אתה מסכים
						לקבל התראות אלה.
					</p>
				</section>

				<section className='mb-5'>
					<h2 className='display-6'>10. כתב ויתור</h2>
					<p className='lead'>
						השירות ניתן "כמות שהוא" וללא אחריות מכל סוג. איננו מתחייבים כי
						הפלטפורמה תהיה זמינה תמיד או נטולת תקלות.
					</p>
				</section>

				<section className='my-5'>
					<h2 className='display-6'>11. הגבלת אחריות</h2>
					<p className='lead'>
						במידת המרב המותרת על פי חוק, לא נהיה אחראים לנזקים עקיפים, אובדן
						נתונים, הכנסות, או כל נזק תוצאתי אחר בגין שימושך בפלטפורמה.
					</p>
				</section>

				<section className='my-5'>
					<h2 className='display-6'>12. שינויים בתנאים</h2>
					<p className='lead'>
						אנו עשויים לעדכן תנאים אלו מעת לעת. נודיע על כך בתוך הפלטפורמה.
						שימוש מתמשך מהווה הסכמה לגרסה המעודכנת.
					</p>
				</section>

				<section className='my-5'>
					<h2 className='display-6'>13. סיום שימוש</h2>
					<p className='lead'>
						אנו שומרים לעצמנו את הזכות להפסיק את גישתך לשירות בכל עת, ללא
						הודעה מוקדמת, בשל כל סיבה, כולל הפרת תנאים אלו.
					</p>
				</section>

				<section className='my-5'>
					<h2 className='display-6'>14. הדין החל</h2>
					<p className='lead'>
						תנאים אלה יפורשו בהתאם לחוקי מדינת ישראל. כל מחלוקת תתברר בבתי
						המשפט בישראל.
					</p>
				</section>

				<section>
					<h2 className='display-6'>15. יצירת קשר</h2>
					<p className='lead'>
						לשאלות או בקשות הקשורות לתנאים אלה, ניתן לפנות אלינו במייל:{" "}
						<a href='mailto:anesmhamed1@gmail.com'>anesmhamed1@gmail.com</a>
					</p>
				</section>
			</div>
		</main>
	);
};

export default TermOfUse;

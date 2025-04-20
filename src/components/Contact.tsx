import {FunctionComponent} from "react";
import {Link} from "react-router-dom";

interface ContactProps {}
/**
 * Mains contact
 * @returns contact infomation
 */
const Contact: FunctionComponent<ContactProps> = () => {
	return (
		<main className=' min-vh-100'>
			<div className='container'>
				<h1 className='text-center display-1'>צור קשר</h1>
				<hr />
				<div className='row justify-content-center'>
					<div className='col-md-10'>
						<h3 className='mb-3 text-center mb-4'>
							שוק הבינה - פירות וירקות אורגניים
						</h3>
						
						<p className='mb-4 lead text-start'>
							אנו ב"שוק הבינה" גאים להציע פירות וירקות טריים ואורגניים
							שנשלחים ישירות אליכם עד דלת הבית, עם דגש על איכות ושירות ברמה
							גבוהה.
							<br />
							<br /> המטרה שלנו היא לספק ללקוחותינו את הפירות והירקות
							הבריאים ביותר, תוך שמירה על עקרונות החקלאות האורגנית וחקלאות
							בת-קיימא. הצטרפו אלינו לאורח חיים בריא וטעים.
						</p>
						<hr className=' text-light' />
						<div className='col-md-8 m-auto'>
							<h3 className='mb-3 text-center mb-4'>
								צור קשר עם צוות "שוק הבינה"
							</h3>
							<p className='text-center mb-4 lead'>
								יש לנו צוות מיומן ומסור שמוכן תמיד לסייע ולענות על כל
								שאלה. בין אם אתם רוצים לברר מידע על המוצרים שלנו, לבצע
								הזמנה או לשוחח על נושא אחר – אנחנו כאן עבורכם.
							</p>
							<h5 className='mt-4'>פרטי קשר:</h5>
							<ul className=' list-group list-unstyled'>
								<li className='text-center list-group-item-action mb-4 p-2  lead fw-bold'>
									<strong>דוא"ל:</strong>
									<Link
										to='mailto:support@fruitsandveg.com'
										className='text-primary ms-1 text-decoration-none'
									>
										support@fruitsandveg.com
									</Link>
								</li>
								<li className='text-center list-group-item-info list-group-item-action mb-4 p-2  lead fw-bold'>
									<strong>טלפון:</strong>
									<Link
										to='tel:+97231234567'
										className='text-primary text-decoration-none ms-1'
									>
										03-1234567
									</Link>
								</li>
							</ul>
							<p className='text-center mb-4 p-2 lead'>
								אנחנו תמיד שמחים לקבל פניות מלקוחותינו, והצוות שלנו עובד
								קשה כדי להבטיח שאתם מקבלים את השירות הטוב ביותר. אל תהססו
								לפנות אלינו בכל שאלה או בקשה.
							</p>

							<hr />

							<h5 className='mt-4'>כתובת</h5>
							<p className='text-center mb-4 p-2 lead'>
								אם אתם מעוניינים לבקר אותנו פיזית, אנו ממוקמים בכתובת:
								<strong> שדרות ירושלים 45, תל אביב</strong>
							</p>

							<p className='text-center mb-4 p-2 lead'>
								תודה על שבחרתם בנו, ונשמח לעזור לכם ליהנות ממזון איכותי
								ובריא!
							</p>
						</div>
					</div>
				</div>
			</div>
		</main>
	);
};

export default Contact;

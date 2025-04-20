import {FunctionComponent} from "react";

interface AboutProps {}
/**
 * Mains about
 * @returns  
 */
const About: FunctionComponent<AboutProps> = () => {
	return (
		<main className='min-vh-100'>
			<div className='container py-5'>
				<div className='row justify-content-center'>
					<div className='col-md-8 text-center'>
						{/* Header */}
						<h1 className='text-center mb-4 p-2 rounded-5 rounded-bottom-0 display-1 fw-bold'>
							אודות
						</h1>
						<div className='about-section'>
							<p className='lead  mb-4 fs-3'>
								פירות וירקות טריים ואורגניים נשלחים אליכם עד דלת הבית, יחד
								עם מגוון רחב של מוצרים איכותיים.
							</p>
						</div>
						

						{/* lifestyle and services */}
						<section className='about-section'>
							<h3 className='my-4'>
								החיים המודרניים והצורך באורח חיים בריא
							</h3>
							<hr />
							<p className='text-center mb-4 fw-medium p-2 lead'>
								החיים המודרניים מלאים בלחץ, ולעיתים קשה למצוא את הזמן
								להקפיד על בריאותנו. אנחנו כאן כדי להקל עליכם ולהביא אליכם
								את המוצרים הבריאים והטריים ביותר ישירות אל דלת הבית.
							</p>
						</section>

						<section className='about-section'>
							<h3 className='my-4'>חקלאות בת קיימא</h3>
							<hr />
							<p className='text-center mb-4 fw-medium p-2 lead'>
								הפירות והירקות שאנו מספקים לא רק שהם טריים ובריאים, אלא גם
								תוצר של חקלאות בת קיימא, שמכבדת את הסביבה. אנחנו גאים
								לעבוד עם חקלאים מקומיים שמקדישים את מרצם להפקת תוצרת
								איכותית, תוך שמירה על עקרונות החקלאות האורגנית.
							</p>
						</section>

						{/* Product Categories */}
						<section className='about-section'>
							<h3 className='my-4'>המוצרים שלנו</h3>
							<hr />
							<p className='text-center mb-4 fw-medium p-2 lead'>
								אנו מציעים מגוון רחב של מוצרים טריים ואורגניים שיספקו לכם
								את כל מה שצריך לשמירה על אורח חיים בריא:
							</p>

							<div className='row'>
								{/* Fruit & Vegetables */}
								<div className='col-12 col-md-6  m-auto'>
									<h4 className='my-2'>פירות וירקות</h4>
									<p>
										פירות וירקות טריים ואורגניים, ישירות מהחקלאים
										אליכם לבית.
									</p>
								</div>

								{/* Dairy Products */}
								<div className='col-12 col-md-6 m-auto'>
									<h4 className='my-2'>מוצרי חלב</h4>
									<p>מבחר מוצרי חלב טריים ואורגניים ממיטב היצרנים.</p>
								</div>

								{/* Meat, Fish, and Spices */}
								<div className='col-12 col-md-6 m-auto'>
									<h4 className='my-2'>בשר, דגים ותבלינים</h4>
									<p>
										בשרים ודגים טריים ואורגניים, יחד עם תבלינים
										איכותיים.
									</p>
								</div>

								{/* Baked Goods */}
								<div className='col-12 col-md-6 m-auto'>
									<h4 className='my-2'>מאפים</h4>
									<p>
										מאפים טריים ואורגניים שיכניסו טעם טוב לכל ארוחה.
									</p>
								</div>

								{/* Beverages */}
								<div className='col-12 col-md-6 m-auto'>
									<h4 className='my-2'>משקאות</h4>
									<p>משקאות טבעיים ואורגניים שיעניקו לכם רעננות.</p>
								</div>

								{/* Frozen Products */}
								<div className='col-12 col-md-6 m-auto'>
									<h4 className='my-2'>מוצרים קפואים</h4>
									<p>
										מגוון מוצרים קפואים איכותיים לשמירה על טריות לאורך
										זמן.
									</p>
								</div>

								{/* Snacks */}
								<div className='col-12 col-md-6 m-auto'>
									<h4 className='my-2'>חטיפים</h4>
									<p>חטיפים טבעיים ואורגניים, מושלמים לכל רגע.</p>
								</div>
							</div>
						</section>

						{/* Continuing to Service and Values */}
						<section className='about-section'>
							<h3 className='my-4'>הקפדה על איכות וטריות</h3>
							<hr />
							<p className='text-center mb-4 fw-medium p-2 lead'>
								אנו מבינים את הצורך להימנע מחשיפה לחומרים כימיים ומפני
								זיהום סביבתי, ולכן כל המוצרים שלנו נטולי חומרי הדברה
								וחומרי סינטטיים. כל ירק וכל פרי עוברים בדיקות קפדניות כדי
								לוודא שהם עומדים בסטנדרטים הגבוהים ביותר.
							</p>
						</section>

						<section className='about-section'>
							<h3 className='my-4'>שירות מהיר ואיכותי</h3>
							<hr />
							<p className='text-center mb-4 fw-medium p-2 lead'>
								הקפדה על איכות, טריות ושירות מצוין הם העקרונות שמנחים
								אותנו. אנו מתחייבים לשלוח את ההזמנות במהירות האפשרית, כך
								שהפירות והירקות יגיעו אליכם בצורה הטובה ביותר.
							</p>
						</section>

						<section className='about-section'>
							<h3 className='my-4'>הצטרפו אלינו לאורח חיים בריא</h3>
							<hr />
							<p className='text-center mb-4 fw-medium p-2 lead'>
								אנחנו גאים להיות חלק ממערכת האוכל האורגני בישראל, ומזמינים
								אתכם להצטרף אלינו וליהנות ממזון איכותי ובריא. הצטרפו אלינו
								לאורח חיים בריא, ותיהנו מיתרונותיו בכל היבט.
							</p>
						</section>

						<section className='about-section'>
							<h3 className='my-4'>המשלוחים יגיעו אליכם בדיוק בזמן</h3>
							<hr />
							<p className='text-center mb-4 fw-medium p-2 rounded-5 rounded-top-0 lead'>
								לא משנה היכן אתם נמצאים בארץ, הפירות והירקות האורגניים
								שלנו יגיעו אליכם בדיוק בזמן, וישלימו את כל מה שצריך כדי
								שתהיו מרוצים ומלאים באנרגיה טובה.
							</p>
						</section>
					</div>
				</div>
			</div>
		</main>
	);
};

export default About;

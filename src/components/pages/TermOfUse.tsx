import {FunctionComponent} from "react";
import {Link} from "react-router-dom";
import {path} from "../../routes/routes";
import {Helmet} from "react-helmet";

interface TermOfUseProps {}

const TermOfUse: FunctionComponent<TermOfUseProps> = () => {
	return (
		<>
			<Helmet>
				<title>شروط الاستخدام | صفقة</title>
				<meta name='description' content={"شروط الاستخدام | صفقة"} />
			</Helmet>
			<main className='min-vh-100 py-5 px-3'>
				<div className='container border border-primary shadow p-5 rounded-4'>
					<h1 className='text-center my-5 text-primary'>תנאי שימוש</h1>
					<p className='text-center mb-5'>
						آخر تحديث: <strong>15/04/2025</strong>
					</p>

					<section aria-labelledby='section1' className='my-5'>
						<h2 id='section1' className='display-6'>
							1. الأهلية
						</h2>
						<p className='lead'>
							يجب أن تكون قد بلغت الثامنة عشرة من عمرك لاستخدام المنصة.
							باستخدامك المنصة، فإنك تُقر وتضمن امتثالك لهذه المتطلبات.
						</p>
					</section>

					<section aria-labelledby='section2' className='my-5'>
						<h2 id='section2' className='display-6'>
							2. سجل للحصول على حساب
						</h2>
						<p className='lead'>
							يُطلب منك إنشاء حساب لاضافه المنتجات للسله والشراء من موقعنا.
							أنت مسؤول عن تزويدنا بمعلومات دقيقة ومحدثة، والحفاظ على سرية
							كلمة مرورك. نحتفظ بالحق في تعليق أو حذف أي حساب في حال وجود أي
							نشاط مشبوه أو انتهاك سياسة الخصوصية.
							<Link
								to={path.PrivacyAndPolicy}
								className='ms-1 text-decoration-underline text-primary'
							>
								سياسة الخصوصية
							</Link>
							.
						</p>
					</section>

					<section aria-labelledby='section3' className='my-5'>
						<h2 id='section3' className='display-6'>
							3. المنتجات والطلبات
						</h2>
						<p className='lead'>
							الأسعار، وتوافر المنتجات، وأوصافها قابلة للتغيير في أي وقت.
							تقديم الطلب لا يضمن قبوله، ويحق لنا رفض أو إلغاء الطلبات وفقًا
							لتقديرنا الخاص.
						</p>
					</section>

					<section aria-labelledby='section4' className='mb-5'>
						<h2 id='section4' className='display-6'>
							4. الدفع
						</h2>
						<p className='lead'>
							(حاليا يمكنك فقط الدفع نقدي)نقبل مجموعة متنوعة من طرق الدفع،
							بما في ذلك بطاقات الائتمان، والدفع النقدي عند استلام الطلب.
							بإدخالك معلومات الدفع، فإنك تُقرّ بأنك مخوّل باستخدام هذه
							الطريقة وأن المعلومات التي قدّمتها صحيحة.
						</p>
					</section>

					<section aria-labelledby='section5' className='mb-5'>
						<h2 id='section5' className='display-6'>
							5. التوصيل والاستلام
						</h2>
						<p className='lead'>
							أوقات التسليم والاستلام تقديرية فقط وليست مضمونة. قد تحدث
							تأخيرات خارجة عن إرادتنا. للعميل حرية الاختيار بين التسليم
							والاستلام الذاتي، رهناً بتوافر المنتج.
						</p>
					</section>

					<section aria-labelledby='section6' className='mb-5'>
						<h2 id='section6' className='display-6'>
							6. الإرجاعات واسترداد الأموال
						</h2>
						الإرجاعات واسترداد الأموال حتى 24 ساعه
					</section>

					<section aria-labelledby='section7' className='mb-5'>
						<h2 id='section7' className='display-6'>
							7. سلوك المستخدم
						</h2>
						<ul className='lead'>
							<li>لا تستخدم المنصة لأغراض غير قانونية.</li>
							<li>لا تنتحل شخصية شخص آخر أو تقدم معلومات كاذبة.</li>
							<li>لا تقم بتحميل أي أكواد ضارة أو تتداخل مع تشغيل المنصة</li>
							<li>
								لا تحاول الوصول إلى الأنظمة التي لا تملك تصريحاً
								لاستخدامها
							</li>
						</ul>
						<p className='lead'>
							قد يؤدي انتهاك هذه الشروط إلى الحظر أو اتخاذ إجراء قانوني
						</p>
					</section>

					<section aria-labelledby='section8' className='mb-5'>
						<h2 id='section8' className='display-6'>
							8. الملكية الفكرية
						</h2>
						<p className='lead'>
							جميع المحتويات والأيقونات والشعارات والبرامج مملوكة لسوق
							السخنيني ام الفحم أو الجهات المرخصة لها. لا يجوز لك نسخ أو
							إعادة إنتاج أو دمج هذا المحتوى دون إذن كتابي
						</p>
					</section>

					<section aria-labelledby='section9' className='mb-5'>
						<h2 id='section9' className='display-6'>
							9. تحديثات في الوقت الحقيقي
						</h2>
						<p className='lead'>
							نستخدم تقنيات متطورة لتحديثات فورية، بما في ذلك حالة الطلب،
							ورسائل الإدارة، وتنبيهات الخصومات. باستخدامك المنصة، فإنك
							توافق على استلام هذه الإشعارات
						</p>
					</section>

					<section aria-labelledby='section10' className='mb-5'>
						<h2 id='section10' className='display-6'>
							10. تنصل
						</h2>
						<p className='lead'>
							تُقدّم الخدمة "كما هي" ودون أي ضمان من أي نوع. لا نضمن أن تكون
							المنصة متاحة دائمًا أو خالية من الأخطاء
						</p>
					</section>

					<section aria-labelledby='section11' className='my-5'>
						<h2 id='section11' className='display-6'>
							11. حدود المسؤولية
						</h2>
						<p className='lead'>
							إلى الحد الأقصى المسموح به بموجب القانون، لن نكون مسؤولين عن
							الأضرار غير المباشرة، أو فقدان البيانات، أو الدخل، أو أي أضرار
							لاحقة أخرى ناشئة عن استخدامك للمنصة
						</p>
					</section>

					<section aria-labelledby='section12' className='my-5'>
						<h2 id='section12' className='display-6'>
							12. تغييرات على الشروط والأحكام
						</h2>
						<p className='lead'>
							قد نقوم بتحديث هذه الشروط من وقت لآخر. سنُعلمك بذلك عبر
							المنصة. يُعدّ الاستمرار في استخدام هذه الشروط موافقةً على
							النسخة المُحدّثة
						</p>
					</section>

					<section aria-labelledby='section13' className='my-5'>
						<h2 id='section13' className='display-6'>
							13. نهاية الاستخدام
						</h2>
						<p className='lead'>
							نحتفظ بالحق في إنهاء وصولك إلى الخدمة في أي وقت، دون إشعار،
							لأي سبب، بما في ذلك انتهاك هذه الشروط
						</p>
					</section>

					<section aria-labelledby='section14' className='my-5'>
						<h2 id='section14' className='display-6'>
							14. القانون ينطبق
						</h2>
						<p className='lead'>
							سيتم تفسير هذه الشروط وفقًا لقوانين دولة إسرائيل. سيتم حل أي
							نزاع في محاكم إسرائيل
						</p>
					</section>

					<section aria-labelledby='section15' className='my-5'>
						<h2 id='section15' className='display-6'>
							15. اتصل بنا
						</h2>
						<p className='lead'>
							لأي أسئلة أو طلبات تتعلق بهذه الشروط، يمكنك الاتصال بنا عبر
							البريد الإلكتروني:{" "}
							<a href='mailto:anesmhamed1@gmail.com'>
								anesmhamed1@gmail.com
							</a>
						</p>
						<p className='lead'>
							هاتف: <a href='tel:+972538346915'>0538346915</a>
						</p>
					</section>
				</div>
			</main>
		</>
	);
};

export default TermOfUse;

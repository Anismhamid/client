import {FunctionComponent} from "react";

interface AboutProps {}

/**
 * صفحة حولنا
 * @returns معلومات عن العمل
 */
const About: FunctionComponent<AboutProps> = () => {
	return (
		<main className='min-vh-100'>
			<div className='container py-5'>
				<div className='row justify-content-center'>
					<div className='col-md-8 text-center'>
						{/* Header */}
						<h1 className='text-center mb-4 p-2 rounded-5 rounded-bottom-0 display-1 fw-bold'>
							حولنا
						</h1>

						<div className='about-section'>
							<p className='lead mb-4 fs-3'>
								فواكه وخضروات طازجة وعضوية تصل إليكم حتى باب المنزل، مع
								مجموعة واسعة من المنتجات عالية الجودة.
							</p>
						</div>

						{/* الحياة العصرية والخدمات */}
						<section className='about-section'>
							<h3 className='my-4'>الحياة العصرية والحاجة لنمط حياة صحي</h3>
							<hr />
							<p className='text-center mb-4 fw-medium p-2 lead'>
								الحياة العصرية مليئة بالضغط، وأحياناً يصعب إيجاد الوقت
								للاهتمام بصحتنا. نحن هنا لتسهيل الأمر عليكم وتقديم
								المنتجات الصحية والطازجة مباشرة إلى باب منزلكم.
							</p>
						</section>

						<section className='about-section'>
							<h3 className='my-4'>الزراعة المستدامة</h3>
							<hr />
							<p className='text-center mb-4 fw-medium p-2 lead'>
								الفواكه والخضروات التي نقدمها ليست فقط طازجة وصحية، بل هي
								نتاج زراعة مستدامة تحترم البيئة. نفخر بالعمل مع مزارعين
								محليين يكرسون جهودهم لإنتاج منتجات عالية الجودة وفقاً
								لمبادئ الزراعة العضوية.
							</p>
						</section>

						{/* فئات المنتجات */}
						<section className='about-section'>
							<h3 className='my-4'>منتجاتنا</h3>
							<hr />
							<p className='text-center mb-4 fw-medium p-2 lead'>
								نقدم مجموعة واسعة من المنتجات الطازجة والعضوية التي توفر
								كل ما تحتاجونه للحفاظ على نمط حياة صحي:
							</p>

							<div className='row'>
								{/* فواكه وخضروات */}
								<div className='col-12 col-md-6 m-auto'>
									<h4 className='my-2'>فواكه وخضروات</h4>
									<p>
										فواكه وخضروات طازجة وعضوية، مباشرة من المزارعين
										إلى منزلكم.
									</p>
								</div>

								{/* منتجات الألبان
								<div className='col-12 col-md-6 m-auto'>
									<h4 className='my-2'>منتجات الألبان</h4>
									<p>
										مجموعة من منتجات الألبان الطازجة والعضوية من أفضل
										المنتجين.
									</p>
								</div> */}

								{/* اللحوم، الأسماك والتوابل */}
								{/* <div className='col-12 col-md-6 m-auto'>
									<h4 className='my-2'>اللحوم، الأسماك والتوابل</h4>
									<p>
										لحوم وأسماك طازجة وعضوية، مع توابل عالية الجودة.
									</p>
								</div> */}

								{/* المخبوزات */}
								{/* <div className='col-12 col-md-6 m-auto'>
									<h4 className='my-2'>المخبوزات</h4>
									<p>مخبوزات طازجة وعضوية تضيف نكهة رائعة لكل وجبة.</p>
								</div> */}

								{/* المشروبات */}
								{/* <div className='col-12 col-md-6 m-auto'>
									<h4 className='my-2'>المشروبات</h4>
									<p>مشروبات طبيعية وعضوية تمنحكم انتعاشاً طبيعياً.</p>
								</div> */}

								{/* المنتجات المجمدة */}
								{/* <div className='col-12 col-md-6 m-auto'>
									<h4 className='my-2'>منتجات مجمدة</h4>
									<p>
										مجموعة منتجات مجمدة عالية الجودة للحفاظ على
										الطزاجة لفترة أطول.
									</p>
								</div> */}

								{/* الوجبات الخفيفة */}
								{/* <div className='col-12 col-md-6 m-auto'>
									<h4 className='my-2'>الوجبات الخفيفة</h4>
									<p>وجبات خفيفة طبيعية وعضوية، مثالية لأي لحظة.</p>
								</div> */}
							</div>
						</section>

						{/* الجودة والخدمة */}
						<section className='about-section'>
							<h3 className='my-4'>الاهتمام بالجودة والطزاجة</h3>
							<hr />
							<p className='text-center mb-4 fw-medium p-2 lead'>
								نحن نفهم أهمية تجنب المواد الكيميائية والتلوث البيئي، لذلك
								جميع منتجاتنا خالية من المبيدات والمواد الاصطناعية. كل
								خضرة وكل فاكهة تمر بفحوصات دقيقة لضمان أعلى معايير الجودة.
							</p>
						</section>

						<section className='about-section'>
							<h3 className='my-4'>خدمة سريعة ومميزة</h3>
							<hr />
							<p className='text-center mb-4 fw-medium p-2 lead'>
								الجودة والطزاجة والخدمة الممتازة هي المبادئ التي نلتزم
								بها. نحرص على إرسال الطلبات بسرعة لضمان وصول الفواكه
								والخضروات بأفضل حال.
							</p>
						</section>

						<section className='about-section'>
							<h3 className='my-4'>انضموا إلينا لنمط حياة صحي</h3>
							<hr />
							<p className='text-center mb-4 fw-medium p-2 lead'>
								نفخر بأن نكون جزءاً من منظومة الطعام العضوي في إسرائيل،
								وندعوكم للانضمام إلينا والاستمتاع بطعام صحي وعالي الجودة.
							</p>
						</section>

						<section className='about-section'>
							<h3 className='my-4'>التوصيل في الوقت المحدد</h3>
							<hr />
							<p className='text-center mb-4 fw-medium p-2 rounded-5 rounded-top-0 lead'>
								بغض النظر عن مكانكم في البلاد، ستصل فواكهنا وخضرواتنا
								العضوية إليكم في الوقت المناسب لتكتمل متعة الطعام الصحي
								والطاقة الجيدة.
							</p>
						</section>

						{/* الموقع */}
						<section className='about-section text-center'>
							<h3 className='my-4'>موقعنا</h3>
							<hr />
							<p className='lead fw-medium p-2'>
								سوق السخنيني، أم الفحم، شارع السوق
							</p>
						</section>
					</div>
				</div>
			</div>
		</main>
	);
};

export default About;

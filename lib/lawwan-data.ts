export const categories = [
  { name: 'العود', icon: '🎸', count: 24 },
  { name: 'البيانو', icon: '🎹', count: 18 },
  { name: 'الجيتار', icon: '🎼', count: 21 },
  { name: 'الغناء', icon: '🎤', count: 16 },
  { name: 'الرسم', icon: '🎨', count: 31 },
  { name: 'التصوير', icon: '📷', count: 14 },
  { name: 'الخط العربي', icon: '✒️', count: 12 },
  { name: 'الفنون الرقمية', icon: '🖌️', count: 19 },
]

export const trainers = [
  { id: 'noura-alharbi', name: 'نورة الحربي', specialty: 'عود وموسيقى شرقية', category: 'العود', rating: 4.9, reviews: 86, price: 150, mode: 'حضوري + أونلاين', city: 'الخبر', initials: 'نح', bio: 'مدرّبة عود وموسيقى بخبرة في تعليم المبتدئين والهواة بطريقة عملية وممتعة.' },
  { id: 'faisal-alqahtani', name: 'فيصل القحطاني', specialty: 'بيانو ونظرية موسيقية', category: 'البيانو', rating: 4.8, reviews: 64, price: 180, mode: 'أونلاين', city: 'الرياض', initials: 'فق', bio: 'مدرّب بيانو يساعدك تبني أساس قوي وتقرأ النوتة وتتقدم بخطة واضحة.' },
  { id: 'reem-alotaibi', name: 'ريم العتيبي', specialty: 'رسم وألوان مائية', category: 'الرسم', rating: 5.0, reviews: 42, price: 120, mode: 'حضوري + أونلاين', city: 'جدة', initials: 'رع', bio: 'فنانة ومدرّبة رسم تركّز على تطوير العين الفنية والمهارات من المستوى المبتدئ.' },
  { id: 'omar-almutairi', name: 'عمر المطيري', specialty: 'جيتار', category: 'الجيتار', rating: 4.9, reviews: 53, price: 140, mode: 'حضوري', city: 'الدمام', initials: 'عم', bio: 'مدرّب جيتار للهواة، من أول كورد إلى عزف الأغاني التي تحبها.' },
  { id: 'sara-alshehri', name: 'سارة الشهري', specialty: 'خط عربي', category: 'الخط العربي', rating: 4.9, reviews: 37, price: 100, mode: 'أونلاين', city: 'الرياض', initials: 'سش', bio: 'متخصصة في الخط العربي وتقديم جلسات تدريبية فردية تناسب مستوى المتعلم.' },
  { id: 'khalid-alrashid', name: 'خالد الراشد', specialty: 'تصوير فوتوغرافي', category: 'التصوير', rating: 4.7, reviews: 29, price: 160, mode: 'حضوري', city: 'الخبر', initials: 'خر', bio: 'مصوّر ومدرّب يساعدك في فهم الإضاءة والتكوين واستخدام الكاميرا بثقة.' },
]

export const upcomingSessions = [
  { trainer: 'نورة الحربي', subject: 'جلسة عود للمبتدئين', date: 'الثلاثاء، 8 سبتمبر', time: '7:00 م', mode: 'أونلاين' },
  { trainer: 'ريم العتيبي', subject: 'أساسيات الألوان المائية', date: 'الخميس، 10 سبتمبر', time: '6:30 م', mode: 'حضوري' },
]

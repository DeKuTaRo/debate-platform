import type { DebateTopic } from "./types"

export const mockTopics: DebateTopic[] = [
  {
    id: "1",
    title: "Nên cấm hoàn toàn xe máy ở trung tâm thành phố lớn",
    description:
      "Việc cấm xe máy có thể giảm ùn tắc và ô nhiễm, nhưng liệu có ảnh hưởng đến quyền di chuyển của người dân?",
    content:
      "Nhiều thành phố lớn trên thế giới đã cấm xe máy ở khu vực trung tâm để giảm thiểu ô nhiễm không khí và ùn tắc giao thông. Tuy nhiên, ở Việt Nam, xe máy là phương tiện di chuyển chính của đa số người dân. Việc cấm xe máy có thể gây khó khăn cho nhiều người, đặc biệt là những người có thu nhập thấp.",
    imageUrl: "/images/traffic-motorcycles.jpg",
    createdAt: new Date("2025-01-15"),
    category: "Giao thông",
  },
  {
    id: "2",
    title: "Học sinh nên được phép sử dụng điện thoại trong giờ học",
    description: "Điện thoại có thể là công cụ học tập hữu ích hay chỉ là nguồn gây xáo trộn?",
    content:
      "Công nghệ đã trở thành một phần không thể thiếu trong cuộc sống. Nhiều người cho rằng việc cho phép học sinh sử dụng điện thoại trong giờ học có thể giúp họ tiếp cận thông tin nhanh chóng và phát triển kỹ năng số. Tuy nhiên, cũng có ý kiến cho rằng điện thoại sẽ làm học sinh mất tập trung và giảm hiệu quả học tập.",
    imageUrl: "/images/students-smartphones.jpg",
    createdAt: new Date("2025-02-20"),
    category: "Giáo dục",
  },
  {
    id: "3",
    title: "Làm việc từ xa nên trở thành tiêu chuẩn mới",
    description: "Sau đại dịch, liệu làm việc từ xa có nên là lựa chọn mặc định cho mọi công việc?",
    content:
      "Đại dịch COVID-19 đã chứng minh rằng nhiều công việc có thể được thực hiện từ xa một cách hiệu quả. Làm việc từ xa giúp tiết kiệm thời gian di chuyển, giảm chi phí văn phòng và tăng sự linh hoạt cho nhân viên. Tuy nhiên, nó cũng có thể gây ra cảm giác cô lập, giảm sự gắn kết trong đội nhóm và khó khăn trong việc phân biệt giữa công việc và cuộc sống cá nhân.",
    imageUrl: "/images/work-from-home.jpg",
    createdAt: new Date("2025-03-10"),
    category: "Công việc",
  },
  {
    id: "4",
    title: "Trí tuệ nhân tạo sẽ thay thế nhiều công việc của con người",
    description: "AI đang phát triển nhanh chóng - đây là cơ hội hay mối đe dọa cho lực lượng lao động?",
    content:
      "Trí tuệ nhân tạo đang ngày càng phát triển và có khả năng thực hiện nhiều công việc mà trước đây chỉ con người mới làm được. Một số người lo ngại về việc mất việc làm hàng loạt, trong khi những người khác tin rằng AI sẽ tạo ra nhiều cơ hội việc làm mới và giúp con người tập trung vào các công việc sáng tạo hơn.",
    imageUrl: "/images/ai-robots.jpg",
    createdAt: new Date("2025-02-05"),
    category: "Công nghệ",
  },
  {
    id: "5",
    title: "Mạng xã hội gây hại nhiều hơn lợi cho giới trẻ",
    description: "Facebook, TikTok, Instagram - những nền tảng này đang kết nối hay phá hủy thế hệ trẻ?",
    content:
      "Mạng xã hội đã trở thành một phần không thể thiếu trong cuộc sống của giới trẻ. Tuy nhiên, nhiều nghiên cứu cho thấy việc sử dụng mạng xã hội quá mức có thể dẫn đến trầm cảm, lo âu, và các vấn đề về sức khỏe tâm thần. Mặt khác, mạng xã hội cũng giúp kết nối mọi người, tạo cơ hội kinh doanh và lan toa thông tin hữu ích.",
    imageUrl: "/images/social-media-youth.jpg",
    createdAt: new Date("2025-01-10"),
    category: "Xã hội",
  },
  {
    id: "6",
    title: "Tiền điện tử nên được công nhận là phương thức thanh toán chính thức",
    description: "Bitcoin, Ethereum và các loại tiền mã hóa có thể thay thế tiền truyền thống?",
    content:
      "Tiền điện tử đang ngày càng phổ biến với lời hứa về giao dịch nhanh chóng, phí thấp và không cần trung gian. Tuy nhiên, sự biến động giá mạnh, rủi ro bảo mật và việc sử dụng cho các hoạt động bất hợp pháp khiến nhiều người hoài nghi về tương lai của tiền mã hóa.",
    imageUrl: "/images/cryptocurrency.jpg",
    createdAt: new Date("2025-12-20"),
    category: "Tài chính",
  },
  {
    id: "7",
    title: "Biến đổi khí hậu là vấn đề cấp bách nhất hiện nay",
    description: "Liệu chúng ta có đang làm đủ để ngăn chặn thảm họa khí hậu toàn cầu?",
    content:
      "Nhiệt độ toàn cầu đang tăng, băng tan, mực nước biển dâng cao. Các nhà khoa học cảnh báo rằng chúng ta chỉ còn vài năm để hành động trước khi hậu quả không thể đảo ngược. Tuy nhiên, việc chuyển đổi sang năng lượng sạch đòi hỏi chi phí lớn và có thể ảnh hưởng đến nền kinh tế.",
    imageUrl: "/images/climate-change.jpg",
    createdAt: new Date("2025-01-05"),
    category: "Môi trường",
  },
  {
    id: "8",
    title: "Giáo dục đại học không còn cần thiết trong thời đại số",
    description: "Với khóa học online và tự học, bằng đại học còn giá trị?",
    content:
      "Nhiều người thành công như Bill Gates, Mark Zuckerberg đã bỏ học đại học. Với sự phát triển của các nền tảng học trực tuyến như Coursera, Udemy, nhiều người cho rằng giáo dục đại học truyền thống đã lỗi thời. Tuy nhiên, bằng cấp vẫn là yêu cầu quan trọng trong nhiều ngành nghề và mang lại kiến thức nền tảng vững chắc.",
    imageUrl: "/images/online-education.jpg",
    createdAt: new Date("2025-11-15"),
    category: "Giáo dục",
  },
  {
    id: "9",
    title: "Thịt nuôi cấy trong phòng thí nghiệm là tương lai của ngành thực phẩm",
    description: "Thịt nhân tạo có thể giải quyết vấn đề môi trường và đạo đức trong chăn nuôi?",
    content:
      "Chăn nuôi gia súc là một trong những nguyên nhân chính gây biến đổi khí hậu. Thịt nuôi cấy trong phòng thí nghiệm hứa hẹn giảm thiểu tác động môi trường và không cần giết động vật. Tuy nhiên, chi phí sản xuất cao, chấp nhận của người tiêu dùng và các vấn đề về an toàn thực phẩm vẫn là những thách thức lớn.",
    imageUrl: "/images/lab-grown-meat.jpg",
    createdAt: new Date("2025-10-25"),
    category: "Khoa học",
  },
  {
    id: "10",
    title: "Nên có luật bắt buộc tiêm chủng cho trẻ em",
    description: "Quyền tự do cá nhân hay trách nhiệm bảo vệ sức khỏe cộng đồng?",
    content:
      "Vắc-xin đã cứu sống hàng triệu người và loại bỏ nhiều bệnh nguy hiểm. Tuy nhiên, một số phụ huynh từ chối tiêm chủng cho con vì lo ngại về tác dụng phụ. Việc bắt buộc tiêm chủng có thể bảo vệ sức khỏe cộng đồng nhưng cũng đặt ra câu hỏi về quyền tự do lựa chọn của cha mẹ.",
    imageUrl: "/images/child-vaccination.jpg",
    createdAt: new Date("2025-01-20"),
    category: "Sức khỏe",
  },
  {
    id: "11",
    title: "Esports nên được công nhận là môn thể thao chính thức",
    description: "Chơi game có thể được coi là thể thao như bóng đá hay bóng rổ?",
    content:
      "Esports đang phát triển mạnh mẽ với hàng triệu người xem và giải thưởng lên đến hàng triệu đô la. Các game thủ chuyên nghiệp luyện tập nhiều giờ mỗi ngày như các vận động viên truyền thống. Tuy nhiên, nhiều người cho rằng chơi game không đòi hỏi thể lực và không nên được coi là thể thao.",
    imageUrl: "/images/esports-gaming.jpg",
    createdAt: new Date("2025-09-30"),
    category: "Thể thao",
  },
  {
    id: "12",
    title: "Nên cấm hoàn toàn túi nilon và đồ nhựa dùng một lần",
    description: "Lệnh cấm nhựa có thể giải quyết ô nhiễm hay chỉ gây bất tiện?",
    content:
      "Rác thải nhựa đang gây ô nhiễm nghiêm trọng cho đại dương và môi trường. Nhiều quốc gia đã cấm túi nilon và đồ nhựa dùng một lần. Tuy nhiên, các giải pháp thay thế như túi giấy, túi vải cũng có tác động môi trường riêng và chi phí cao hơn, ảnh hưởng đến người tiêu dùng và doanh nghiệp.",
    imageUrl: "/images/plastic-pollution.jpg",
    createdAt: new Date("2025-08-18"),
    category: "Môi trường",
  },
]

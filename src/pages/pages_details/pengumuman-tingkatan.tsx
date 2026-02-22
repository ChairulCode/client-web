import { useParams, useNavigate } from "react-router-dom";
import { Bell, Calendar, AlertCircle, Info, Wrench, Megaphone } from "lucide-react";
import { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import "./css/pengumuman-tingkatan.css";
import Footer from "../../components/footer";
import { getRequest } from "../../utils/api-call";
import { Pagination } from "../../components/pagination/pagination";
import { formatTime } from "../../utils/time-format";

export interface Metadata {
	totalItems: number;
	totalPages: number;
	currentPage: number;
	limit: number;
}

export interface Jenjang {
	jenjang_id: string;
	nama_jenjang: string;
	kode_jenjang: string;
}

export interface Jenjang_relasi {
	pengumuman_id: string;
	jenjang_id: string;
	jenjang: Jenjang;
}

export interface Data {
	pengumuman_id: string;
	judul: string;
	deskripsi: string;
	konten: string;
	tanggal_publikasi: string;
	is_published: boolean;
	is_featured: boolean;
	created_at: string;
	updated_at: string;
	jenjang_id?: string;
	penulis_user_id: string;
	editor_user_id?: string;
	jenjangJenjang_id?: string;
	jenjang_relasi: Jenjang_relasi[];
}

export interface AnnouncementsResponse {
	message: string;
	metadata: Metadata;
	data: Data[];
}

const PengumumanTingkatan = () => {
	const { level } = useParams<{ level: string }>();
	const navigate = useNavigate();
	const [data, setData] = useState<AnnouncementsResponse["data"] | null>(null);
	const [backupData, setBackupData] = useState<AnnouncementsResponse["data"] | null>(null);
	const params = useParams();

	// PAGINATION
	const [page, setPage] = useState(1);
	const totalData = backupData?.length || 0;
	const limit = 6;
	const totalPages = Math.ceil(totalData / limit);

	// Normalize level
	const currentLevel = level?.toUpperCase() as "SD" | "SMP" | "SMA" | "PG-TK" | undefined;

	useEffect(() => {
		AOS.init({
			duration: 800,
			once: true,
			offset: 100,
		});
	}, []);

	useEffect(() => {
		const getData = async () => {
			try {
				const response: AnnouncementsResponse = await getRequest("pengumuman?page=1&limit=1000");

				if (params?.level) {
					const filteredData = response.data.filter((item) => item.jenjang_relasi.some((relasi) => relasi.jenjang.kode_jenjang === params.level));
					console.log(response);

					setBackupData(filteredData);
					setData(filteredData.slice(0, page * limit));
					return;
				}
				setData(response.data);
			} catch (error) {
				console.log(error);
			}
		};
		getData();
	}, []);

	useEffect(() => {
		if (backupData) {
			setData(backupData.slice((page - 1) * limit, page * limit));
		}
	}, [page]);

	// Format level title
	const getLevelTitle = (lvl: string | undefined) => {
		const levelMap: { [key: string]: string } = {
			"PG-TK": "PG-TK",
			SD: "SD",
			SMP: "SMP",
			SMA: "SMA",
		};
		return levelMap[lvl || ""] || lvl?.toUpperCase();
	};

	// Get type config
	// const getTypeConfig = (type: string) => {
	// 	switch (type) {
	// 		case "maintenance":
	// 			return {
	// 				icon: Wrench,
	// 				label: "Pemeliharaan",
	// 				className: "pt-type-maintenance",
	// 			};
	// 		case "update":
	// 			return {
	// 				icon: Bell,
	// 				label: "Update",
	// 				className: "pt-type-update",
	// 			};
	// 		case "info":
	// 		default:
	// 			return {
	// 				icon: Info,
	// 				label: "Informasi",
	// 				className: "pt-type-info",
	// 			};
	// 	}
	// };

	return (
		<div className='pt-page'>
			{/* Breadcrumb */}
			<div className='pt-breadcrumb' data-aos='fade-down'>
				<button onClick={() => navigate("/pengumuman")} className='pt-breadcrumb-link'>
					Pengumuman
				</button>
				<span className='pt-breadcrumb-separator'>/</span>
				<span className='pt-breadcrumb-current'>{getLevelTitle(currentLevel)}</span>
			</div>

			<div className='pt-container'>
				{/* Hero Header */}
				<div className='pt-hero' data-aos='fade-down'>
					<div className='pt-hero-icon'>
						<Megaphone size={48} strokeWidth={2.5} />
					</div>
					<h1 className='pt-hero-title'>Pengumuman {getLevelTitle(currentLevel)}</h1>
					<p className='pt-hero-desc'>Informasi dan pengumuman khusus untuk tingkat {getLevelTitle(currentLevel)}</p>
					<div className='pt-hero-badge'>
						<AlertCircle size={16} />
						<span>{data && data.length} Pengumuman</span>
					</div>
				</div>

				{/* Content */}
				{data && data.length === 0 ? (
					<div className='pt-empty' data-aos='fade-up'>
						<div className='pt-empty-icon'>📭</div>
						<h3>Belum Ada Pengumuman</h3>
						<p>Belum ada pengumuman untuk tingkat {getLevelTitle(currentLevel)} saat ini</p>
						<button className='pt-btn-back' onClick={() => navigate(-1)}>
							<svg width='16' height='16' viewBox='0 0 16 16' fill='none'>
								<path d='M10 13L5 8L10 3' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
							</svg>
							<span>Kembali</span>
						</button>
					</div>
				) : (
					<div className='pt-grid'>
						{data &&
							data.map((announcement, index) => {
								// const typeConfig = getTypeConfig(announcement.type);
								// const TypeIcon = typeConfig.icon;

								return (
									<div key={announcement.pengumuman_id} className='pt-card' data-aos='fade-up' data-aos-delay={index * 80}>
										{/* Card Header */}
										{/* <div className={`pt-card-header ${typeConfig.className}`}>
											<div className='pt-card-icon'>
												<TypeIcon size={20} />
											</div>
											<span className='pt-card-type'>{typeConfig.label}</span>
										</div> */}

										{/* Card Body */}
										<div className='pt-card-body'>
											<h3 className='pt-card-title'>{announcement.judul}</h3>

											<div className='pt-card-meta'>
												<Calendar size={16} />
												<span>{formatTime(announcement.tanggal_publikasi, "DD MMMM yyyy")}</span>
											</div>

											<p className='pt-card-desc'>{announcement.deskripsi}</p>
										</div>

										{/* Card Footer */}
										<div className='pt-card-footer'>
											{announcement.jenjang_relasi.map((level) => (
												<span className='pt-card-level'>{getLevelTitle(level.jenjang.nama_jenjang)}</span>
											))}
										</div>

										{/* Decorative Element */}
										<div className='pt-card-accent'></div>
									</div>
								);
							})}
					</div>
				)}

				<Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
			</div>
			<Footer />
		</div>
	);
};

export default PengumumanTingkatan;

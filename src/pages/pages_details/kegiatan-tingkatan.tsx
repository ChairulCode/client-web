import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
// import { activities } from "../../data";
import "./css/kegiatan-tingkatan.css";
import Footer from "../../components/footer";
import { getRequest } from "../../utils/api-call";
import { formatTime } from "../../utils/time-format";
import { Pagination } from "../../components/pagination/pagination";

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
	kegiatan_id: string;
	jenjang_id: string;
	jenjang: Jenjang;
}

export interface Data {
	kegiatan_id: string;
	judul: string;
	deskripsi: string;
	konten: string;
	path_gambar: string;
	tanggal_publikasi: string;
	is_published: boolean;
	is_featured: boolean;
	created_at: string;
	updated_at: string;
	penulis_user_id: string;
	editor_user_id?: string;
	jenjangJenjang_id?: string;
	jenjang_relasi: Jenjang_relasi[];
}

export interface ActivitiesResponse {
	message: string;
	metadata: Metadata;
	data: Data[];
}

const BASE_URL = import.meta.env.VITE_BASE_URL;

const KegiatanTingkatan = () => {
	const navigate = useNavigate();
	const [data, setData] = useState<ActivitiesResponse["data"] | null>(null);
	const [backupData, setBackupData] = useState<ActivitiesResponse["data"] | null>(null);
	const params = useParams();

	// PAGINATION
	const [page, setPage] = useState(1);
	const totalData = backupData?.length || 0;
	const limit = 6;
	const totalPages = Math.ceil(totalData / limit);

	// Initialize AOS animation
	useEffect(() => {
		AOS.init({
			duration: 1000,
			once: true,
			offset: 100,
		});
	}, []);

	useEffect(() => {
		const getData = async () => {
			try {
				const response: ActivitiesResponse = await getRequest("kegiatan?page=1&limit=1000");

				if (params?.level) {
					const filteredData = response.data.filter((item) => item.jenjang_relasi.some((relasi) => relasi.jenjang.kode_jenjang === params.level));
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

	// Fungsi untuk format level jadi lebih readable
	const getLevelTitle = (level: string | undefined) => {
		const levelMap: { [key: string]: string } = {
			"pg-tk": "PG-TK",
			sd: "SD",
			smp: "SMP",
			sma: "SMA",
		};
		return levelMap[level || ""] || level?.toUpperCase();
	};

	// Get level color
	const getLevelColor = (level: string | undefined) => {
		const colorMap: { [key: string]: string } = {
			"pg-tk": "#FF6B9D",
			sd: "#4ECDC4",
			smp: "#FFD93D",
			sma: "#6C5CE7",
		};
		return colorMap[level || ""] || "#ddc588";
	};

	// Get level icon
	const getLevelIcon = (level: string | undefined) => {
		const iconMap: { [key: string]: string } = {
			"pg-tk": "🎨",
			sd: "📚",
			smp: "🔬",
			sma: "🎓",
		};
		return iconMap[level || ""] || "📖";
	};

	return (
		<div className='kt-page'>
			{/* Breadcrumb */}
			<div className='kt-breadcrumb' data-aos='fade-down'>
				<button onClick={() => navigate("/kegiatan")} className='kt-breadcrumb-link'>
					Kegiatan
				</button>
				<span className='kt-breadcrumb-separator'>/</span>
				<span className='kt-breadcrumb-current'>{getLevelTitle(params.level)}</span>
			</div>

			<div className='kt-wrapper'>
				{/* Header with Icon */}
				<div className='kt-header' data-aos='fade-down'>
					<div className='kt-icon' style={{ background: getLevelColor(params.level) }}>
						{getLevelIcon(params.level)}
					</div>
					<h1 className='kt-title'>Kegiatan {getLevelTitle(params.level)}</h1>
					<p className='kt-desc'>
						Menampilkan {data && data.length} kegiatan untuk tingkat {getLevelTitle(params.level)}
					</p>
				</div>

				{data && data.length > 0 ? (
					<div className=''>
						<div className='kt-list'>
							{data &&
								data.map((act, index) => (
									<div key={act.kegiatan_id} className='kt-card' data-aos='fade-up' data-aos-delay={index * 100}>
										<div className='kt-card-image-wrapper'>
											<img src={`${BASE_URL}/${act.path_gambar}`} alt={act.judul} className='kt-img' />
											<div className='kt-card-overlay'>
												<span className='kt-level-badge' style={{ background: getLevelColor(params.level) }}>
													{getLevelTitle(params.level)}
												</span>
											</div>
										</div>
										<div className='kt-content'>
											<span className='kt-date'>📅 {formatTime(act.tanggal_publikasi, "DD MMMM yyyy")}</span>
											<h2>{act.judul}</h2>
											<p>{act.konten}</p>
											<button className='kt-btn' onClick={() => navigate(`/kegiatan/${act.kegiatan_id}`)}>
												<span>Baca Selengkapnya</span>
												<svg width='16' height='16' viewBox='0 0 16 16' fill='none'>
													<path d='M6 3L11 8L6 13' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
												</svg>
											</button>
										</div>
									</div>
								))}
						</div>
						<Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
					</div>
				) : (
					<div className='kt-empty' data-aos='fade-up'>
						<div className='kt-empty-icon'>📭</div>
						<h3>Belum Ada Kegiatan</h3>
						<p>Belum ada kegiatan untuk tingkat {getLevelTitle(params.level)} saat ini.</p>
						<button className='kt-btn-back' onClick={() => navigate(-1)}>
							<svg width='16' height='16' viewBox='0 0 16 16' fill='none'>
								<path d='M10 13L5 8L10 3' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
							</svg>
							<span>Kembali</span>
						</button>
					</div>
				)}
			</div>
			<Footer />
		</div>
	);
};

export default KegiatanTingkatan;

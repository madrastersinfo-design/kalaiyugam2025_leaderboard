import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import BrandLogo from "./assets/madrasters-logo.svg";
import TitleLogo from "./assets/kalaiyugam.svg";
import FlowerLeft from "./assets/mara.png";
import FlowerRight from "./assets/conc.png";
import "./App.css";

type LeaderboardEntry = {
    fullName: string;
    instaId: string;
    streak: number;
    level: number;
    badge: number;
    sortValue: number;
};

const Leaderboard = () => {
    const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyjthWzRuXO6H-Ozx49tg5hd0lJE8qMS0XAEs7Di7JGnuFP5SbuclPzwOkvWe30B0Y3_A/exec";
    const navigate = useNavigate();




    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                setIsLoading(true);

                const response = await fetch(GOOGLE_SCRIPT_URL);
                const json = await response.json();

                setLeaderboardData(json.data);
            } catch (error) {
                console.error("Error fetching leaderboard:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchLeaderboard();
    }, []);



    const mapToDisplayLevel = (badge: number): 1 | 2 => {
        if (badge <= 1) return 1;
        return 2;
    };



    const getBadgeAccent = (badge: number): string => {
        const level = mapToDisplayLevel(badge);
        return level === 1 ? "🌱" : "🌸";
    };

    // const badgeImage = getBadgeImage(user.badge, badges);

    const sortedUsers = [...leaderboardData].sort((a, b) => b.sortValue - a.sortValue);
    const levelCards = useMemo(() => ([
        {
            id: 1,
            title: "Level 1",
            tamil: "மொட்டு",
            translit: "(Mottu)",
            description: "The Bud",
            accent: "🌱"
        },
        {
            id: 2,
            title: "Level 2",
            tamil: "மலர்ச்சி",
            translit: "(Malarcci)",
            description: "The Bloom",
            accent: "🌸"
        }
    ]), []);

    if (isLoading) {
        return (
            <div className="page">
                <div className="background">
                    <img className="flower-left" src={FlowerLeft} alt="" aria-hidden="true" />
                    <img className="flower-right" src={FlowerRight} alt="" aria-hidden="true" />
                    <img className="brand-logo" src={BrandLogo} alt="Madrasters" />
                    <img className="title-logo" src={TitleLogo} alt="Kalaiyugam" />
                    <button
                        type="button"
                        className="leaderboard-nav-button"
                        onClick={() => navigate('/')}
                    >
                        Back to Submission Form ✏️
                    </button>
                    <div className="leaderboard-banner">
                        {levelCards.map(level => (
                            <div key={level.id} className="leaderboard-level-card">
                                <div className="leaderboard-level-card__header">
                                    {level.title}
                                </div>
                                <div className="leaderboard-level-card__body">
                                    <span className="leaderboard-level-card__accent">{level.accent}</span>
                                    <div className="leaderboard-level-card__label">{level.tamil}</div>
                                    <div className="leaderboard-level-card__sub">{level.translit}</div>
                                    <div className="leaderboard-level-card__desc">{level.description}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="leaderboard-card loading">
                        <div className="lds-roller">Loading</div>
                    </div>
                </div>
            </div>
        )
    } else {
        return (
            <div className="page">
                <div className="background">
                    <img className="flower-left" src={FlowerLeft} alt="" aria-hidden="true" />
                    <img className="flower-right" src={FlowerRight} alt="" aria-hidden="true" />
                    <img className="brand-logo" src={BrandLogo} alt="Madrasters" />
                    <img className="title-logo" src={TitleLogo} alt="Kalaiyugam" />
                    <button
                        type="button"
                        className="leaderboard-nav-button"
                        onClick={() => navigate('/')}
                    >
                        Back to Submission Form ✏️
                    </button>

                    <div className="leaderboard-banner">
                        {levelCards.map(level => (
                            <div key={level.id} className="leaderboard-level-card">
                                <div className="leaderboard-level-card__header">
                                    {level.title}
                                </div>
                                <div className="leaderboard-level-card__body">
                                    <span className="leaderboard-level-card__accent">{level.accent}</span>
                                    <div className="leaderboard-level-card__label">{level.tamil}</div>
                                    <div className="leaderboard-level-card__sub">{level.translit}</div>
                                    <div className="leaderboard-level-card__desc">{level.description}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="leaderboard-card">
                        <div className="leaderboard-card-header">
                            <span className="leaderboard-card-icon">🌼</span>
                            <h2 className="leaderboard-title">Leaderboard</h2>
                        </div>

                        <div className="leaderboard-list">
                            {sortedUsers.map((user) => {
                                const displayLevel = mapToDisplayLevel(user.badge);
                                return (
                                    <div key={user.instaId} className="leaderboard-row-wrapper">
                                        <div className="leaderboard-row">
                                            <div className="profile-container">
                                                <div className="profile-info">
                                                    <div className="profile-name">{user.fullName}</div>
                                                    <div className="profile-tags">
                                                        <span
                                                            className="profile-handle"
                                                            onClick={() => window.open(`https://instagram.com/${user.instaId}`, '_blank')}
                                                            style={{ cursor: 'pointer' }}
                                                        >
                                                            @{user.instaId}
                                                        </span>
                                                        <span className={`profile-level level-chip ${displayLevel === 1 ? 'level-1' : 'level-2'}`}>
                                                            {displayLevel === 1 ? "Level 01" : "Level 02"}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="leaderboard-row-accent">
                                                <span className="leaderboard-row-accent__emoji">{getBadgeAccent(user.badge)}</span>

                                            </div>
                                        </div>
                                        <div className="divider" />
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
};

export default Leaderboard;

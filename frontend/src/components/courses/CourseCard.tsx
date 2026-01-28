import { Star, Clock, User, BookOpen, Users } from 'lucide-react';
import { motion } from 'framer-motion';

interface CourseCardProps {
    title: string;
    instructor: string;
    rating: number;
    reviews: number;
    price: number;
    duration: string;
    thumbnail: string;
    category: string;
    lessons?: number;
    students?: number;
    level?: string;
    isFeatured?: boolean;
}

const CourseCard = ({
    title,
    instructor,
    rating,
    price,
    duration,
    thumbnail,
    category,
    lessons = 12,
    students = 1200,
    level = "Beginner",
    isFeatured = false
}: CourseCardProps) => {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="group flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-all hover:shadow-xl"
        >
            {/* Thumbnail */}
            <div className="relative aspect-[16/10] w-full overflow-hidden">
                <img
                    src={thumbnail}
                    alt={title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Badges Overlay */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {isFeatured && (
                        <span className="w-fit rounded-md bg-amber-400 px-3 py-1 text-xs font-bold text-[#0f2238] shadow-sm">
                            Featured
                        </span>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="flex flex-1 flex-col p-6">
                {/* Category & Level */}
                <div className="mb-4 flex items-center gap-2">
                    <span className={`rounded px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${level === 'Beginner' ? 'bg-emerald-50 text-emerald-600' :
                            level === 'Intermediate' ? 'bg-amber-50 text-amber-600' :
                                'bg-red-50 text-red-600'
                        }`}>
                        {level}
                    </span>
                    <span className="rounded bg-slate-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        {category}
                    </span>
                </div>

                <h3 className="mb-3 text-lg font-bold text-[#0f2238] line-clamp-2 min-h-[3.5rem] group-hover:text-blue-600 transition-colors">
                    {title}
                </h3>

                <p className="mb-6 text-sm text-slate-500 line-clamp-2">
                    Master {category.toLowerCase()} with this comprehensive guide containing over {lessons} lessons and real-world projects.
                </p>

                {/* Metadata Row */}
                <div className="mb-6 flex items-center gap-4 text-xs font-medium text-slate-400 border-b border-slate-50 pb-6">
                    <div className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{duration}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <BookOpen className="h-3.5 w-3.5" />
                        <span>{lessons} lessons</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Users className="h-3.5 w-3.5" />
                        <span>{students}</span>
                    </div>
                </div>

                {/* Footer: Instructor & Price */}
                <div className="mt-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0f2238] text-white text-xs font-bold">
                            {instructor.charAt(0)}
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs font-bold text-[#0f2238]">{instructor}</span>
                            <div className="flex items-center gap-1 text-amber-500">
                                <Star className="h-3 w-3 fill-current" />
                                <span className="text-[10px] font-bold">{rating.toFixed(1)}</span>
                            </div>
                        </div>
                    </div>
                    <div className="text-lg font-black text-[#0f2238]">
                        ${price}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default CourseCard;

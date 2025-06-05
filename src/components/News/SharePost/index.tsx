import React from "react"
import { Link } from "../../Link"

import { CiShare2 } from "react-icons/ci";

const SharePost = () => {
    return (
        <div className="hidden md:flex justify-between items-center gap-10 py-10">
            <div className="bg-[#3E3355] w-full h-[1px] "></div>
            <div className="flex flex-col items-center">
                <p className="tab-button-text mb-4">Share this post</p>
                <div className="flex items-center gap-4">
                    <Link to="#share-buttons">
                        <button className="bg-pink px-6 py-3 rounded-[80px] tab-button-text flex items-center gap-3">
                            <CiShare2 size={25} />
                            Share
                        </button>
                    </Link>
                </div>
            </div>
            <div className="bg-[#3E3355] w-full h-[1px] inline-block"></div>
        </div>
    )
}

export default SharePost

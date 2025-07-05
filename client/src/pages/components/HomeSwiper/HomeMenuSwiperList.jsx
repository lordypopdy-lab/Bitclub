import React from 'react'

const HomeMenuSwiperList = () => {
    return (
        <div>
            <div className="wrap-filter-swiper">
                <h5><a href="/assetsRatings" className="cryptex-rating"><i className="icon-star"></i>Bitclub Rating</a></h5>
                <div className="swiper-wrapper1 menu-tab-v3 mt-12" role="tablist">
                    <div className="swiper-slide1 nav-link active" data-bs-toggle="tab" data-bs-target="#favorites" role="tab" aria-controls="favorites" aria-selected="true">
                        Top
                    </div>
                    <div className="swiper-slide1 nav-link" data-bs-toggle="tab" data-bs-target="#top" role="tab" aria-controls="top" aria-selected="false">
                        Favorites
                    </div>
                    <div className="swiper-slide1 nav-link" data-bs-toggle="tab" data-bs-target="#popular" role="tab" aria-controls="popular" aria-selected="false">
                        Popular
                    </div>
                    <div className="swiper-slide1 nav-link" data-bs-toggle="tab" data-bs-target="#gainers" role="tab" aria-controls="price" aria-selected="false">
                        Gainers
                    </div>
                    <div className="swiper-slide1 nav-link" data-bs-toggle="tab" data-bs-target="#losers" role="tab" aria-controls="new" aria-selected="false">
                        Losers
                    </div>
                    <div className="swiper-slide1 nav-link" data-bs-toggle="tab" data-bs-target="#cap" role="tab" aria-controls="new" aria-selected="false">
                        Market Cap
                    </div>
                </div>
                {/* <!-- </div> --> */}
            </div>
        </div>
    )
}

export default HomeMenuSwiperList

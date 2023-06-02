import dynamic from 'next/dynamic'

const PageView = dynamic(() => import( "../../components/pageView/pageView"), {
    ssr: false
})

const Home = () => {
    return(
        <div>
            <PageView/>
        </div>
    )
}

export default Home
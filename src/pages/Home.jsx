import { useState } from 'react';
import Logo from '../img/main-logo.png';
import { Link, useNavigate} from 'react-router-dom';
import { WalletNotConnectedError } from '@solana/wallet-adapter-base';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';

const Home = () => {
  const { publicKey, sendTransaction, wallet } = useWallet();

  const [mainMenu, setMainMenu]= useState()

  const [apply, setApply] = useState(false)
  const [info, setInfo] = useState(false)
  const [partneredProjects, setPartneredProjects] = useState(false)

  const [open, setOpen] = useState(false)

  const handleClick = (type) => {
    if (type === "apply"){
      setApply(!apply)
      setInfo(false)
      setPartneredProjects(false)
    }
    else if (type === "info"){
      setInfo(!info)
      setApply(false)
      setPartneredProjects(false)
    }
    else if (type === "partneredProjects"){
      setPartneredProjects(!partneredProjects)
      setApply(false)
      setInfo(false)
    }
  }

  const navigate = useNavigate();

  const navigateToCustomizer = () => {
    navigate('/customize');
  };

  return (
    <section className='bg-white-off w-full h-full py-10 md:py-32'>
        <div className="bg-white-off py-10 md:py-32">
            <div className='max-w-[550px] mx-auto grid grid-cols-1 md:grid-cols-2 items-center gap-x-12 px-5 mb-5'>
              <div className="logo">
                  <img src={Logo} alt="Logo" />
              </div>
              <div className="logo">
                <h1 className='font-title-bold text-4xl font-bold text-primary-red'>THE</h1>
                <h1 className='font-title-bold text-4xl font-bold text-primary-red'>BODY SHOP</h1>
                <p className='font-text font-medium'>
                  a robust trait marketplace
                  to upgrade and customize
                  your NFTs powered by maxin'
                </p>
              </div>
            </div>
            <button onClick={() => handleClick("apply")} className='w-full bg-primary-red text-white font-title-bold text-sm md:text-xl py-2'>GET THE BODY SHOP FOR YOUR PROJECT</button>
              <nav className={ !apply ? 'h-0 opacity-0 invisible' : 'w-full visible h-full opacity-1 bg-dark-gray py-5 duration-75'}>
                <div className='text-center py-5 px-10'>
                  <h6 className='mb-5 font-text text-sm text-primary-yellow font-bold tracking-wider'>Fill out the form below and we will get back to you ASAP</h6>
                    <div className='text-center'>
                        <a href={'https://forms.gle/xxmHxBqKqBStRJoN9'} className='max-w-[400px] bg-dark font-text px-3 py-1 text-primary-yellow text-m uppercase' target="_blank" rel="noreferrer">APPLY NOW!</a>
                    </div>
                </div>
              </nav>
            <button className='w-full bg-primary-red-tint text-white font-title-bold text-sm md:text-xl py-2' onClick={() => handleClick("info")}>HOW IT WORKS</button>
              <nav className={ !info ? 'h-0 opacity-0 invisible' : 'w-full visible h-full opacity-1 bg-dark-gray py-5 duration-75'}>
                <div className='lg:flex-center lg:mx-60 lg:text-justify sm:text-justify py-5 px-10'>
                  <h6 className='mb-5 font-text text-sm text-primary-yellow font-bold tracking-wider'>
                    The Body Shop is a no-code platform for projects that introduces dynamic NFT customization, upgrading, evolution, and creation. This white-label solution is available to all NFT projects (with mutable metadata) in the solana ecosystem to create their very own trait shop, NFT builder, and NFT customizer.
                  </h6>
                  <h6 className='mb-5 font-text text-sm text-primary-yellow font-bold tracking-wider'>
                    Our software enables holders to collect and use newly created Trait SFTs in order to customize their avatar/pfp NFT with minimal transaction fees and provides creators a completely new revenue stream and creative utility.
                  </h6>
                    <div className='text-center'>
                        <a href={'https://forms.gle/xxmHxBqKqBStRJoN9'} className='max-w-[400px] bg-dark font-text px-3 py-1 text-primary-yellow text-m uppercase' target="_blank" rel="noreferrer">APPLY NOW!</a>
                    </div>
                </div>
              </nav>
            <button className='w-full bg-primary-yellow text-white font-title-bold text-sm md:text-xl py-2' onClick={() => handleClick("partneredProjects")}> TOOLS & FUNCTIONALITY </button>
              <nav className={ !partneredProjects ? 'h-0 opacity-0 invisible' : 'w-full visible h-full opacity-1 bg-dark-gray py-5 duration-75'}>
                <div className='lg:flex-center lg:mx-60 lg:text-justify sm:text-justify py-5 px-10'>
                      <h6 className='mb-2 font-text text-sm text-primary-yellow font-bold tracking-wider underline'>
                        Trait Shop:
                      </h6>
                      <h6 className='mb-2 font-text text-sm text-primary-yellow tracking-wider'>
                        The trait shop is the primary tool in our platform and allows projects to create and sell ‘Trait SFTs’ for their specific collection through a custom front end marketplace.
                      </h6>
                      <h6 className='mb-5 font-text text-sm text-primary-yellow tracking-wider'>
                        The trait shop has full NFT creation functionality so that projects can customize their traits with their images, information, and metadata. These newly created SFTs can be sold via their own store front in Solana or any other SPL token at whatever price and supply. Traits are divided by categories and easily searchable for a clean consumer-experience.
                      </h6>
                      <h6 className='mb-2 font-text text-sm text-primary-yellow font-bold tracking-wider underline'>
                        Collection Builder:
                      </h6>
                      <h6 className='mb-2 font-text text-sm text-primary-yellow tracking-wider'>
                        The collection builder is a much needed upgrade to customizing logic for a collections art and generation. This tool allows projects to upload their artwork and create restrictions on trait combinations, layering orders, and conflicts all without needing to write a line of code.
                      </h6>
                      <h6 className='mb-5 font-text text-sm text-primary-yellow tracking-wider'>
                        This builder can be pushed live for an interactive experience for your users to test and play around with your collection and your artwork.
                      </h6>
                      <h6 className='mb-2 font-text text-sm text-primary-yellow font-bold tracking-wider underline'>
                        Dynamic Customizer:
                      </h6>
                      <h6 className='mb-2 font-text text-sm text-primary-yellow tracking-wider'>
                        The customizer is a front end application that allows holders to apply Trait SFTs to your collection for on-chain upgrades. This customizer uses the collection logic programmed into the collection builder and enables holders to preview how their customized NFT will look like before fully upgrading their NFT.
                      </h6>
                      <div className='text-center'>
                          <a href={'https://forms.gle/xxmHxBqKqBStRJoN9'} className='max-w-[400px] bg-dark font-text px-3 py-1 text-primary-yellow text-m uppercase' target="_blank" rel="noreferrer">APPLY NOW!</a>
                      </div>
                </div>
              </nav>
        </div>
    </section>
  )

}

export default Home;

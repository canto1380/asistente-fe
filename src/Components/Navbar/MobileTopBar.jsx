
import LogoImg from '../../../public/logo-horizontal-1.png'

const MobileTopBar = ({logout}) => {
    return (
        <div className="md:hidden bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-center sticky top-0 z-20">
            <div className='flez items-center justify-center gap-2'>
                <img src={LogoImg} alt="Logo" className='h-12 object-contain' />
            </div>
            
        </div>
    )
}

export default MobileTopBar;
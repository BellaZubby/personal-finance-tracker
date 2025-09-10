import React from 'react'

type Props = {
    children: React.ReactNode;
}

const HeaderText = ({children}: Props) => {
  return (
    <h1 className="basis-3/5 font-playfair sm:text-4xl xxs:text-[30px] fold:text-[24px] text-[30px] font-bold mb-6 text-amber-400">
        {children}
    </h1>
  )
}

export default HeaderText
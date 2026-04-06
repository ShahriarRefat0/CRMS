export const uploadImage = async ( imageFile) =>{
    const formdata = new FormData();

    formdata.append('image', imageFile);
    const res = await fetch(`https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`,
        {
            method: "POST",
            body: formdata,
        }
    );

    const data = await res.json();
    return data.data.url;
}
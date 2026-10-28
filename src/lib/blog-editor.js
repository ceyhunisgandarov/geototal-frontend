export function insertBlogImage(text,start,end,url,caption) {
  if(!/^https:\/\//.test(url))throw new Error("Şəkil ünvanı düzgün deyil.");
  const label=String(caption || '').replace(/[\[\]\r\n]/g,' ').trim();
  if(!label)throw new Error("Şəkil üçün izah yazın.");
  const safeUrl=url.replace(/[()\s]/g,c=>c==='('?'%28':c===')'?'%29':encodeURIComponent(c));
  const before=text.slice(0,start),after=text.slice(end);
  return `${before}${before?'\n\n':''}![${label}](${safeUrl})\n\n*${label.replace(/[*_]/g,'')}*${after?'\n\n':''}${after}`;
}
export function blogSaveError(error) {
  const message=error?.response?.data?.status?.message;
  if(typeof message==='string' && message.trim())return message;
  if(error?.response?.status===413)return 'Fayl və ya mətn çox böyükdür. Şəklin həcmini azaldın.';
  if([401,403].includes(error?.response?.status))return 'Giriş vaxtı bitib və ya icazə yoxdur. Yenidən daxil olun.';
  return 'Saxlanmadı: serverlə əlaqəni yoxlayıb yenidən cəhd edin.';
}

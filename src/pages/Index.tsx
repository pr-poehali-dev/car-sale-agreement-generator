import { useState, useRef } from "react";
import Icon from "@/components/ui/icon";

type Section = "seller" | "buyer" | "car" | "deal" | "signatures" | "preview";

interface PersonData {
  fullName: string;
  passport: string;
  passportIssued: string;
  passportDate: string;
  birthDate: string;
  address: string;
  phone: string;
}

interface CarData {
  brand: string;
  model: string;
  year: string;
  vin: string;
  regNumber: string;
  color: string;
  engineVolume: string;
  engineNumber: string;
  bodyNumber: string;
  pts: string;
  ptsIssued: string;
  mileage: string;
}

interface DealData {
  price: string;
  date: string;
  place: string;
  paymentMethod: string;
  withPts: boolean;
  withSts: boolean;
  carCondition: string;
}

const emptyPerson: PersonData = {
  fullName: "", passport: "", passportIssued: "", passportDate: "",
  birthDate: "", address: "", phone: "",
};

const emptyCar: CarData = {
  brand: "", model: "", year: "", vin: "", regNumber: "", color: "",
  engineVolume: "", engineNumber: "", bodyNumber: "", pts: "", ptsIssued: "", mileage: "",
};

const emptyDeal: DealData = {
  price: "", date: "", place: "", paymentMethod: "наличными",
  withPts: true, withSts: true, carCondition: "соответствует техническим требованиям",
};

const sections: { id: Section; label: string; icon: string }[] = [
  { id: "seller", label: "Продавец", icon: "User" },
  { id: "buyer", label: "Покупатель", icon: "UserCheck" },
  { id: "car", label: "Автомобиль", icon: "Car" },
  { id: "deal", label: "Условия сделки", icon: "FileText" },
  { id: "signatures", label: "Подписи", icon: "PenLine" },
  { id: "preview", label: "Договор", icon: "Eye" },
];

const numToWords = (n: string): string => {
  const num = parseInt(n.replace(/\s/g, ""), 10);
  if (isNaN(num) || num === 0) return "";
  const ones = ["", "одна", "две", "три", "четыре", "пять", "шесть", "семь", "восемь", "девять",
    "десять", "одиннадцать", "двенадцать", "тринадцать", "четырнадцать", "пятнадцать",
    "шестнадцать", "семнадцать", "восемнадцать", "девятнадцать"];
  const tens = ["", "", "двадцать", "тридцать", "сорок", "пятьдесят",
    "шестьдесят", "семьдесят", "восемьдесят", "девяносто"];
  const hundreds = ["", "сто", "двести", "триста", "четыреста", "пятьсот",
    "шестьсот", "семьсот", "восемьсот", "девятьсот"];
  const parts: string[] = [];
  if (num >= 1000000) return `${num} рублей`;
  if (num >= 1000) {
    const t = Math.floor(num / 1000);
    const tParts: string[] = [];
    if (Math.floor(t / 100)) tParts.push(hundreds[Math.floor(t / 100)]);
    const tr = t % 100;
    if (tr < 20) { if (tr) tParts.push(ones[tr]); }
    else { tParts.push(tens[Math.floor(tr / 10)]); if (tr % 10) tParts.push(ones[tr % 10]); }
    const tLast = t % 10;
    const tPre = t % 100;
    const tWord = tPre >= 11 && tPre <= 14 ? "тысяч" : tLast === 1 ? "тысяча" : tLast >= 2 && tLast <= 4 ? "тысячи" : "тысяч";
    parts.push([...tParts, tWord].join(" "));
  }
  const r = num % 1000;
  if (r > 0) {
    const rParts: string[] = [];
    if (Math.floor(r / 100)) rParts.push(hundreds[Math.floor(r / 100)]);
    const rr = r % 100;
    if (rr < 20) { if (rr) rParts.push(ones[rr]); }
    else { rParts.push(tens[Math.floor(rr / 10)]); if (rr % 10) rParts.push(ones[rr % 10]); }
    parts.push(rParts.join(" "));
  }
  const last = num % 10;
  const pre = num % 100;
  const rub = pre >= 11 && pre <= 14 ? "рублей" : last === 1 ? "рубль" : last >= 2 && last <= 4 ? "рубля" : "рублей";
  return parts.join(" ") + " " + rub;
};

const formatDate = (dateStr: string): string => {
  if (!dateStr) return "«___» _________ 20___ г.";
  const d = new Date(dateStr);
  const months = ["января","февраля","марта","апреля","мая","июня","июля","августа","сентября","октября","ноября","декабря"];
  return `«${d.getDate()}» ${months[d.getMonth()]} ${d.getFullYear()} г.`;
};

const blank = (val: string, placeholder = "_________________") => val || placeholder;

export default function Index() {
  const [active, setActive] = useState<Section>("seller");
  const [seller, setSeller] = useState<PersonData>(emptyPerson);
  const [buyer, setBuyer] = useState<PersonData>(emptyPerson);
  const [car, setCar] = useState<CarData>(emptyCar);
  const [deal, setDeal] = useState<DealData>(emptyDeal);
  const [vinLoading, setVinLoading] = useState(false);
  const [vinResult, setVinResult] = useState<string | null>(null);
  const printRef = useRef<HTMLDivElement>(null);

  const lookupVin = async () => {
    if (!car.vin && !car.regNumber) return;
    setVinLoading(true);
    setVinResult(null);
    await new Promise(r => setTimeout(r, 1800));
    setVinLoading(false);
    setVinResult("demo");
    setCar(prev => ({
      ...prev,
      brand: prev.brand || "Toyota",
      model: prev.model || "Camry",
      year: prev.year || "2019",
      color: prev.color || "Белый",
      engineVolume: prev.engineVolume || "2.5",
    }));
  };

  const handlePrint = () => {
    const content = printRef.current?.innerHTML;
    if (!content) return;
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(`<!DOCTYPE html><html><head>
      <meta charset="UTF-8"><title>Договор купли-продажи</title>
      <link href="https://fonts.googleapis.com/css2?family=Merriweather:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet">
      <style>
        body{font-family:'Merriweather',serif;font-size:12pt;line-height:1.9;color:#111;padding:18mm 24mm;max-width:210mm;margin:0 auto}
        h1{text-align:center;font-size:14pt;text-transform:uppercase;letter-spacing:2px;margin-bottom:4px}
        h2{font-size:12pt;text-transform:uppercase;margin:18px 0 8px;border-bottom:1px solid #ccc;padding-bottom:4px}
        .subtitle{text-align:center;font-size:11pt;margin-bottom:20px;color:#444}
        p{margin:7px 0;text-align:justify}
        .sign-row{display:flex;justify-content:space-between;margin-top:40px;gap:20px}
        .sign-col{flex:1}
        .sign-line{border-bottom:1px solid #111;margin:28px 0 4px}
        @media print{body{padding:10mm 15mm}}
      </style></head><body>${content}</body></html>`);
    win.document.close();
    setTimeout(() => { win.focus(); win.print(); }, 400);
  };

  const contractHtml = `
    <h1>Договор купли-продажи транспортного средства</h1>
    <p class="subtitle">${formatDate(deal.date)}&nbsp;&nbsp;&nbsp;&nbsp;${blank(deal.place, "г. ___________")}</p>
    <p>Гражданин(ка) <strong>${blank(seller.fullName)}</strong>${seller.birthDate ? `, ${new Date(seller.birthDate).getFullYear()} г.р.,` : ","} паспорт ${blank(seller.passport)}, выдан ${blank(seller.passportIssued)}${seller.passportDate ? " " + formatDate(seller.passportDate) : ""}, проживающий(ая): ${blank(seller.address)}, именуемый(ая) в дальнейшем «<strong>Продавец</strong>», с одной стороны, и</p>
    <p>гражданин(ка) <strong>${blank(buyer.fullName)}</strong>${buyer.birthDate ? `, ${new Date(buyer.birthDate).getFullYear()} г.р.,` : ","} паспорт ${blank(buyer.passport)}, выдан ${blank(buyer.passportIssued)}${buyer.passportDate ? " " + formatDate(buyer.passportDate) : ""}, проживающий(ая): ${blank(buyer.address)}, именуемый(ая) в дальнейшем «<strong>Покупатель</strong>», с другой стороны, заключили настоящий договор о нижеследующем:</p>
    <h2>1. Предмет договора</h2>
    <p>1.1. Продавец продаёт, а Покупатель приобретает транспортное средство:</p>
    <p>Марка, модель: <strong>${blank(car.brand)} ${blank(car.model)}</strong> &nbsp;|&nbsp; Год выпуска: <strong>${blank(car.year)}</strong> &nbsp;|&nbsp; Цвет: <strong>${blank(car.color)}</strong></p>
    <p>VIN: <strong>${blank(car.vin)}</strong> &nbsp;|&nbsp; Гос. номер: <strong>${blank(car.regNumber)}</strong></p>
    <p>Двигатель №: <strong>${blank(car.engineNumber)}</strong> &nbsp;|&nbsp; Объём: <strong>${blank(car.engineVolume)} л.</strong> &nbsp;|&nbsp; Кузов №: <strong>${blank(car.bodyNumber)}</strong></p>
    <p>ПТС: <strong>${blank(car.pts)}</strong>, выдан: <strong>${blank(car.ptsIssued)}</strong></p>
    <p>Пробег: <strong>${blank(car.mileage)} км.</strong></p>
    <h2>2. Цена и расчёты</h2>
    <p>2.1. Стоимость составляет <strong>${blank(deal.price)} рублей (${deal.price ? numToWords(deal.price) : blank("", "сумма прописью")})</strong>.</p>
    <p>2.2. Оплата производится <strong>${deal.paymentMethod}</strong> в момент подписания договора.</p>
    <h2>3. Передача ТС</h2>
    <p>3.1. ТС передаётся в момент подписания договора в состоянии: ${blank(deal.carCondition)}.</p>
    <p>3.2. Вместе с ТС передаются:${deal.withPts ? " ПТС;" : ""}${deal.withSts ? " СТС;" : ""} комплект ключей.</p>
    <h2>4. Гарантии продавца</h2>
    <p>4.1. Транспортное средство никому не продано, не заложено, в споре, под арестом и запретом не состоит, свободно от прав третьих лиц.</p>
    <h2>5. Заключительные положения</h2>
    <p>5.1. Договор составлен в 2 экземплярах, имеющих одинаковую юридическую силу.</p>
    <p>5.2. Договор вступает в силу с момента подписания.</p>
    <div class="sign-row">
      <div class="sign-col">
        <p><strong>ПРОДАВЕЦ</strong></p>
        <div class="sign-line"></div>
        <p style="font-size:10pt">${blank(seller.fullName, "________________________")}</p>
      </div>
      <div class="sign-col">
        <p><strong>ПОКУПАТЕЛЬ</strong></p>
        <div class="sign-line"></div>
        <p style="font-size:10pt">${blank(buyer.fullName, "________________________")}</p>
      </div>
    </div>
  `;

  const inputCls = "w-full px-3 py-2.5 rounded-lg border border-border bg-white text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary transition-all placeholder:text-muted-foreground/50";

  const renderPersonForm = (label: string, data: PersonData, setData: (d: PersonData) => void) => (
    <div className="animate-fade-in space-y-5">
      <h2 className="text-xl font-semibold text-foreground">{label}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2 space-y-1.5">
          <label className="text-sm font-medium text-muted-foreground">ФИО полностью</label>
          <input type="text" value={data.fullName} onChange={e => setData({...data, fullName: e.target.value})} placeholder="Иванов Иван Иванович" className={inputCls} />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-muted-foreground">Серия и номер паспорта</label>
          <input type="text" value={data.passport} onChange={e => setData({...data, passport: e.target.value})} placeholder="0000 000000" className={inputCls} />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-muted-foreground">Дата выдачи</label>
          <input type="date" value={data.passportDate} onChange={e => setData({...data, passportDate: e.target.value})} className={inputCls} />
        </div>
        <div className="md:col-span-2 space-y-1.5">
          <label className="text-sm font-medium text-muted-foreground">Кем выдан паспорт</label>
          <input type="text" value={data.passportIssued} onChange={e => setData({...data, passportIssued: e.target.value})} placeholder="Название органа, выдавшего паспорт" className={inputCls} />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-muted-foreground">Дата рождения</label>
          <input type="date" value={data.birthDate} onChange={e => setData({...data, birthDate: e.target.value})} className={inputCls} />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-muted-foreground">Телефон</label>
          <input type="tel" value={data.phone} onChange={e => setData({...data, phone: e.target.value})} placeholder="+7 (___) ___-__-__" className={inputCls} />
        </div>
        <div className="md:col-span-2 space-y-1.5">
          <label className="text-sm font-medium text-muted-foreground">Адрес регистрации</label>
          <input type="text" value={data.address} onChange={e => setData({...data, address: e.target.value})} placeholder="Полный адрес по прописке" className={inputCls} />
        </div>
      </div>
    </div>
  );

  const renderCarForm = () => (
    <div className="animate-fade-in space-y-5">
      <h2 className="text-xl font-semibold text-foreground">Информация об автомобиле</h2>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Icon name="Zap" size={15} className="text-blue-700" />
          <p className="text-sm font-semibold text-blue-800">Автозаполнение по VIN или гос. номеру</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input type="text" value={car.vin} onChange={e => setCar({...car, vin: e.target.value.toUpperCase()})}
            placeholder="VIN (17 символов)" className="w-full px-3 py-2.5 rounded-lg border border-blue-200 bg-white text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 uppercase" />
          <input type="text" value={car.regNumber} onChange={e => setCar({...car, regNumber: e.target.value.toUpperCase()})}
            placeholder="Гос. номер А123БВ777" className="w-full px-3 py-2.5 rounded-lg border border-blue-200 bg-white text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 uppercase" />
        </div>
        <button onClick={lookupVin} disabled={vinLoading || (!car.vin && !car.regNumber)}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-700 text-white rounded-lg text-sm font-medium hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
          {vinLoading ? (
            <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Проверяем данные...</>
          ) : (
            <><Icon name="Search" size={15} />Найти автомобиль</>
          )}
        </button>
        {vinResult === "demo" && (
          <p className="text-xs text-blue-700 flex items-center gap-1.5">
            <Icon name="CheckCircle" size={13} />
            Данные подставлены. Проверьте и отредактируйте при необходимости.
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {([["Марка","brand"],["Модель","model"],["Год выпуска","year"],["Цвет","color"],["Объём двигателя (л)","engineVolume"],["Пробег (км)","mileage"],["Номер двигателя","engineNumber"],["Номер кузова","bodyNumber"],["Серия и номер ПТС","pts"],["Кем выдан ПТС","ptsIssued"]] as [string, keyof CarData][]).map(([lbl, key]) => (
          <div key={key} className="space-y-1.5">
            <label className="text-sm font-medium text-muted-foreground">{lbl}</label>
            <input type="text" value={car[key]} onChange={e => setCar({...car, [key]: e.target.value})} className={inputCls} />
          </div>
        ))}
      </div>
    </div>
  );

  const renderDealForm = () => (
    <div className="animate-fade-in space-y-5">
      <h2 className="text-xl font-semibold text-foreground">Условия сделки</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-muted-foreground">Дата договора</label>
          <input type="date" value={deal.date} onChange={e => setDeal({...deal, date: e.target.value})} className={inputCls} />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-muted-foreground">Место составления</label>
          <input type="text" value={deal.place} onChange={e => setDeal({...deal, place: e.target.value})} placeholder="г. Москва" className={inputCls} />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-muted-foreground">Стоимость (руб.)</label>
          <input type="text" value={deal.price}
            onChange={e => setDeal({...deal, price: e.target.value.replace(/\D/g,"")})}
            placeholder="1500000" className={inputCls} />
          {deal.price && <p className="text-xs text-muted-foreground italic">{numToWords(deal.price)}</p>}
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-muted-foreground">Способ оплаты</label>
          <select value={deal.paymentMethod} onChange={e => setDeal({...deal, paymentMethod: e.target.value})} className={inputCls}>
            <option value="наличными">Наличными</option>
            <option value="безналичным переводом на банковский счёт Продавца">Безналичный перевод</option>
            <option value="через банковскую ячейку">Банковская ячейка</option>
          </select>
        </div>
        <div className="md:col-span-2 space-y-1.5">
          <label className="text-sm font-medium text-muted-foreground">Техническое состояние</label>
          <input type="text" value={deal.carCondition} onChange={e => setDeal({...deal, carCondition: e.target.value})} className={inputCls} />
        </div>
      </div>
      <div className="space-y-3 pt-1">
        <p className="text-sm font-medium text-muted-foreground">Документы при передаче</p>
        {([["withPts","ПТС (Паспорт транспортного средства)"],["withSts","СТС (Свидетельство о регистрации)"]] as [keyof DealData, string][]).map(([key, label]) => (
          <label key={String(key)} className="flex items-center gap-3 cursor-pointer">
            <div onClick={() => setDeal({...deal, [key]: !(deal[key] as boolean)})}
              className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${deal[key] ? "bg-primary border-primary" : "border-border bg-white"}`}>
              {deal[key] && <Icon name="Check" size={12} className="text-white" />}
            </div>
            <span className="text-sm text-foreground">{label}</span>
          </label>
        ))}
      </div>
    </div>
  );

  const renderSignatures = () => (
    <div className="animate-fade-in space-y-6">
      <h2 className="text-xl font-semibold text-foreground">Подписи и печати</h2>
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
        <p className="text-sm font-semibold text-amber-800 mb-1">Важно</p>
        <p className="text-sm text-amber-700">Подписи проставляются сторонами лично после распечатки. Ниже — предварительный вид.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[{label:"Продавец",name:seller.fullName},{label:"Покупатель",name:buyer.fullName}].map(({label,name}) => (
          <div key={label} className="bg-white border border-border rounded-xl p-5 space-y-4">
            <p className="font-semibold text-foreground uppercase text-sm tracking-wide">{label}</p>
            <p className="text-sm text-muted-foreground">{name || "ФИО не указано"}</p>
            <div className="border-b-2 border-dashed border-muted pt-10" />
            <p className="text-xs text-muted-foreground text-center">подпись / расшифровка</p>
            <div className="border border-dashed border-muted rounded-lg h-16 flex items-center justify-center">
              <p className="text-xs text-muted-foreground">место для печати (при наличии)</p>
            </div>
          </div>
        ))}
      </div>
      <p className="text-sm text-muted-foreground">Договор составляется в 2 экземплярах — по одному для каждой стороны.</p>
    </div>
  );

  const renderPreview = () => (
    <div className="animate-fade-in space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-xl font-semibold text-foreground">Предпросмотр договора</h2>
        <button onClick={handlePrint}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-all shadow-sm">
          <Icon name="Printer" size={16} />
          Печать / PDF
        </button>
      </div>
      <div className="bg-white border border-border rounded-xl shadow-sm overflow-hidden">
        <div ref={printRef} className="font-serif text-[13px] leading-[1.9] text-gray-900 p-8 md:p-12"
          dangerouslySetInnerHTML={{ __html: contractHtml }} />
      </div>
    </div>
  );

  const score = (() => {
    const checks = [seller.fullName, seller.passport, seller.address, buyer.fullName, buyer.passport, buyer.address, car.brand, car.model, car.vin, deal.price, deal.date, deal.place];
    return Math.round((checks.filter(Boolean).length / checks.length) * 100);
  })();

  const activeIdx = sections.findIndex(s => s.id === active);

  return (
    <div className="min-h-screen bg-background font-sans">
      <header className="bg-white border-b border-border sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center shadow-sm">
              <Icon name="FileText" size={17} className="text-white" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-foreground leading-tight">ДКП Авто</h1>
              <p className="text-xs text-muted-foreground">Договор купли-продажи</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2">
              <div className="w-32 h-1.5 bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full transition-all duration-500" style={{width:`${score}%`}} />
              </div>
              <span className="text-xs text-muted-foreground font-medium">{score}%</span>
            </div>
            {score >= 50 && (
              <button onClick={() => setActive("preview")}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-primary border border-primary/30 rounded-lg hover:bg-primary/5 transition-all">
                <Icon name="Eye" size={13} />
                Просмотр
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6 md:flex md:gap-6">
        <aside className="hidden md:block w-52 shrink-0">
          <nav className="space-y-1 sticky top-20">
            {sections.map((s, i) => {
              const isActive = active === s.id;
              return (
                <button key={s.id} onClick={() => setActive(s.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left ${
                    isActive ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}>
                  <Icon name={s.icon} size={15} />
                  <span>{s.label}</span>
                  {i < 5 && (
                    <div className={`ml-auto w-1.5 h-1.5 rounded-full ${i === 0 && seller.fullName ? "bg-green-400" : i === 1 && buyer.fullName ? "bg-green-400" : i === 2 && car.brand ? "bg-green-400" : i === 3 && deal.price ? "bg-green-400" : "bg-transparent"}`} />
                  )}
                </button>
              );
            })}
          </nav>
        </aside>

        <div className="md:hidden flex gap-2 overflow-x-auto pb-3 w-full -mx-4 px-4 scrollbar-none">
          {sections.map(s => (
            <button key={s.id} onClick={() => setActive(s.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all shrink-0 ${
                active === s.id ? "bg-primary text-primary-foreground shadow-sm" : "bg-white border border-border text-muted-foreground"
              }`}>
              <Icon name={s.icon} size={13} />
              {s.label}
            </button>
          ))}
        </div>

        <main className="flex-1 min-w-0">
          <div className="bg-white border border-border rounded-xl p-6 md:p-8 shadow-sm">
            {active === "seller" && renderPersonForm("Данные продавца", seller, setSeller)}
            {active === "buyer" && renderPersonForm("Данные покупателя", buyer, setBuyer)}
            {active === "car" && renderCarForm()}
            {active === "deal" && renderDealForm()}
            {active === "signatures" && renderSignatures()}
            {active === "preview" && renderPreview()}
          </div>

          <div className="flex justify-between mt-4">
            {activeIdx > 0 && (
              <button onClick={() => setActive(sections[activeIdx - 1].id)}
                className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <Icon name="ChevronLeft" size={16} />
                Назад
              </button>
            )}
            {activeIdx < sections.length - 1 && (
              <button onClick={() => setActive(sections[activeIdx + 1].id)}
                className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-all ml-auto shadow-sm">
                Далее
                <Icon name="ChevronRight" size={16} />
              </button>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

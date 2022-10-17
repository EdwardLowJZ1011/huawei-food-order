
export default function PageTitle({page}){
 
    return (<section id="page-title">

    <div className="container clearfix">
        <h1>{page.title}</h1>
        <ol className="breadcrumb">
            <li className="breadcrumb-item"><a href="#">Home</a></li>
            <li className="breadcrumb-item active" aria-current="page">{page.title}</li>
        </ol>
    </div>

</section>);
}
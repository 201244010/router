import React from 'react';

import './agreement.scss';

const MODULE = 'h5privacy';

export default function Privacy(props) {
    return (
        <div className='sm-agreement'>
            <h2>{intl.get(MODULE, 0)/*_i18n:我们向您承诺*/}</h2>
            <p>{intl.get(MODULE, 1)/*_i18n:本隐私政策规定了上海商米科技有限公司及其关联公司（下文简称“商米”或“我们”）如何收集、使用、披露、处理和保护您在我们硬件设备以及我们在设备上提供的应用程序套装的产品和服务时提供给我们的信息。若我们要求您提供某些信息，以便在使用商米产品和服务时验证您的身份，我们将严格遵守本隐私政策和/或我们的用户条款与条件来使用这些信息。*/}</p>
            <p>{intl.get(MODULE, 2)/*_i18n:本隐私政策在制定时充分考虑到您的需求，您全面了解我们的个人资料收集和使用惯例，而且确信自己最终能控制提供给商米的个人信息，这一点至关重要。*/}</p>
            <p>{intl.get(MODULE, 3)/*_i18n:在这项隐私政策中，“个人信息”指通过信息本身或通过与商米能够访问的个人的其他信息联系后能够识别特定个人的数据。此类个人信息包括但不限于您的设备信息，位置信息，登录日志信息。*/}</p>
            <p>{intl.get(MODULE, 4)/*_i18n:通过使用商米产品和服务，即表示您已阅读、认可并接受本隐私政策中所述之所有条款，并包括我们随时作出的任何变更。为满足适用的相关法律，包括您所在地的数据保护法规（例如欧盟的一般数据保护条例），我们会特别寻求您明确的同意来对特殊类别的个人信息进行专项处理 （ 例如自动化决策）。同时我们承诺遵照适用的相关法律来保护您的个人信息的隐私、机密和安全，我们的全体员工和代理商都会同样履行这些义务。*/}</p>
            <p>{intl.get(MODULE, 5)/*_i18n:最后，我们所希望的就是为我们的用户带来最好的体验。如果您对这一隐私政策中概括的数据处理惯例有任何疑问，请通过privacy@sunmi.com联系我们，以便我们处理您的特殊需求。我们很高兴能直接处理您的问题。*/}</p>
            <h2>{intl.get(MODULE, 6)/*_i18n:收集哪些信息以及如何使用信息？*/}</h2>
            <h3>{intl.get(MODULE, 7)/*_i18n:收集的信息类别*/}</h3>
            <p>{intl.get(MODULE, 8)/*_i18n:为了向您提供我们的服务，我们会要求您提供我们向您提供服务所必需的个人信息。如果您不提供个人信息，我们可能无法向您提供我们的产品或服务。*/}</p>
            <p>{intl.get(MODULE, 9)/*_i18n:我们仅收集具有特定、明确及合法的目的所必需的信息，而不会以与这些目的不相符的方式进一步处理相关信息。我们收集以下各类信息（无论其是否为个人信息）：*/}</p>
            <ul>
                <li>{intl.get(MODULE, 10)/*_i18n:位置信息：位置相关的各类信息。例如，国家代码、城市代码、经纬度信息等，设备主要通过GPS、无线局域网或信号塔来确定您设备的大致位置，收集、维护和使用位置数据便于我们提供和改进平台服务。*/}</li>
                <li>{intl.get(MODULE, 11)/*_i18n:网络信息：AP设备使用的网络相关信息。例如，网络运营商、IP地址、MAC地址、网络带宽，此类信息的收集有助于AP更好的为您提供网络服务。*/}</li>
                <li>{intl.get(MODULE, 12)/*_i18n:活跃信息：是否使用设备或APP的相关信息。例如，当天您的设备处于开机状态，我们会把这台设备标志为活跃。*/}</li>
                <li>{intl.get(MODULE, 13)/*_i18n:使用信息：与您使用AP设备功能的相关数据。例如，CPU占用，APP功能使用情况，终端接入情况等，收集此类信息的目的在于优化设备性能，改善APP功能，提升用户体验。*/}</li>
                <li>{intl.get(MODULE, 14)/*_i18n:其他基本信息：AP设备软硬件版本，设备ID，运行APP的设备型号、操作系统版本等必要的信息。*/}</li>
                <li>{intl.get(MODULE, 67)}</li>
                <li>{intl.get(MODULE, 68)}</li>
                <li>{intl.get(MODULE, 69)}</li>
                <li>{intl.get(MODULE, 70)}</li>
                <li>{intl.get(MODULE, 71)}</li>
            </ul>
            <h3>{intl.get(MODULE, 15)/*_i18n:这些设备数据将会被如何使用*/}</h3>
            <p>{intl.get(MODULE, 16)/*_i18n:收集设备数据的目的在于向您提供产品或服务，并且我们保证遵守适用的相关法律。您特此同意我们出于本隐私政策规定的目的处理设备数据，并同意向我们的第三方渠道商披露相关设备数据。*/}</p>
            <p>{intl.get(MODULE, 17)/*_i18n:我们可能会将您的个人信息用于下列目的：*/}</p>
            <ul>
                <li>{intl.get(MODULE, 18)/*_i18n:提供、处理、维护、改善、开发我们的设备或提供给您的服务，包括售后服务和客户支持，以及通过设备或网站提供的服务。*/}</li>
                <li>{intl.get(MODULE, 19)/*_i18n:与您就您的设备、服务或任何普通查询（例如更新、客户咨询支持、我们活动的相关信息、通知）等进行交流。*/}</li>
                <li>{intl.get(MODULE, 20)/*_i18n:分析和开发与我们产品及服务的使用相关的统计信息，以更好地改进我们的产品和服务。*/}</li>
                <li>{intl.get(MODULE, 21)/*_i18n:优化设备的性能，例如分析应用程序的内存使用情况或应用的CPU利用率。*/}</li>
                <li>{intl.get(MODULE, 22)/*_i18n:储存并维护与您相关的信息，用于我们运营业务或履行法律义务。关于我们如何使用您的信息（其中可能包含个人信息），下面提供了更多详细信息。*/}</li>
            </ul>
            <h3>{intl.get(MODULE, 23)/*_i18n:我们与谁分享您的信息？*/}</h3>
            <p>{intl.get(MODULE, 24)/*_i18n:我们不会将任何个人信息非法披露给第三方。*/}</p>
            <p>{intl.get(MODULE, 25)/*_i18n:我们有时可能会向第三方（定义见下文）披露您的个人信息，以便提供您要求的产品或服务。*/}</p>
            <p>{intl.get(MODULE, 26)/*_i18n:我们可能会向本部分下文列出的第三方渠道商作出披露。在本部分所述的各种情况下，您可以放心，商米仅会根据您的授权共享您的个人信息，您对于商米的授权中将会包括处理您的个人信息的子处理者。您应当了解，在下文描述的任何情况下，当商米与第三方渠道商共享您的个人信息时，商米会通过合同规定第三方的实践和义务，遵守适用的地方数据保护法。*/}</p>
            <h3>{intl.get(MODULE, 27)/*_i18n:与我们集团和第三方服务供应商共享信息*/}</h3>
            <p>{intl.get(MODULE, 28)/*_i18n:为了顺利地从事商业经营，以向您提供产品和服务的全部功能，我们可能不时向其他的第三方渠道商（我们的代理商、销售设备渠道商、应用开发商等）（统称为“第三方服务供应商”）披露您的个人信息。此类第三方渠道商可能代表商米或出于上述的一项或多项目的处理您的设备数据。*/}</p>
            <h3>{intl.get(MODULE, 29)/*_i18n:不需要同意的信息*/}</h3>
            <ul>
                <li>{intl.get(MODULE, 30)/*_i18n:我们可能以汇总的形式与第三方（例如我们网站上的广告商）共享匿名信息，用于商业目的；我们可能与其共享我们服务的一般使用趋势，例如设备活跃数量等。*/}</li>
                <li>{intl.get(MODULE, 31)/*_i18n:为避免疑问，在当地数据保护法律明确许可的范围内且仅限在此情况下，商米公司才会在未经您同意的情况下收集、使用或披露您的个人信息。*/}</li>
            </ul>
            <h2>{intl.get(MODULE, 32)/*_i18n:安全保障*/}</h2>
            <h3>{intl.get(MODULE, 33)/*_i18n:商米的安全措施*/}</h3>
            <p>{intl.get(MODULE, 34)/*_i18n:我们承诺保证您的个人信息安全。为了防止未经授权的访问、披露或其他类似风险，我们落实了合理的物理、电子和管理措施流程，保护我们从您的设备中收集的信息。我们将采取所有合理的措施保护您的个人信息。*/}</p>
            <p>{intl.get(MODULE, 35)/*_i18n:例如，当您的设备向我们的服务器发送或收取信息时，我们确保使用安全套接层(SSL)和其他算法对其进行加密。*/}</p>
            <p>{intl.get(MODULE, 36)/*_i18n:您的个人信息全都被储存在安全的服务器上，并在受控设施中受到保护。我们依据重要性和敏感性对您的数据进行分类，并且保证您的个人信息具有最高的安全等级。我们保证通过访问这些信息来帮助向您提供产品和服务的员工和第三方服务供应商具有严格的合同保密义务，如果未能履行这些义务，其将会受到纪律处分或被终止合作。同样，我们对以云为基础的数据存储设有专门的访问控制措施。总而言之，我们定期审查信息收集、储存和处理实践，包括物理安全措施，以防止任何未经授权的访问和使用。*/}</p>
            <p>{intl.get(MODULE, 37)/*_i18n:我们将采取所有可行的措施保护您的个人信息安全。但是，您应当意识到互联网的使用并不总是安全的，因此，我们不能保证在通过互联网双向传输时任何个人信息的安全性或完整性。*/}</p>
            <p>{intl.get(MODULE, 38)/*_i18n:我们将对于个人数据的泄露，及时通知相关的监管机构，并在一些特别的环境下，通知数据主体相关的数据泄露事件，以满足适用的相关法律，包括您所在地的数据保护法规。*/}</p>
            <h2>{intl.get(MODULE, 39)/*_i18n:您可以控制您的信息！*/}</h2>
            <h3>{intl.get(MODULE, 40)/*_i18n:控制设置*/}</h3>
            <p>{intl.get(MODULE, 41)/*_i18n:商米承认每个人对隐私权的关注各不相同。因此，我们提供了一些示例，说明商米提供的各种方式，供您选择，以限制收集、使用、披露或处理您的设备信息，并控制您的隐私权设置：*/}</p>
            <ul>
                <li>{intl.get(MODULE, 42)/*_i18n:打开或者关闭各项收集的数据；*/}</li>
            </ul>
            <p>{intl.get(MODULE, 43)/*_i18n:如果您之前因为上述目的同意我们使用您的个人信息，您可以随时通过书面或者向 privacy@sunmi.com 发送邮件的方式联系我们来改变您的决定。*/}</p>
            <h3>{intl.get(MODULE, 44)/*_i18n:访问、更新、修正您的个人信息*/}</h3>
            <ul>
                <li>{intl.get(MODULE, 45)/*_i18n:您有权要求访问和/或更正我们持有的与您有关的任何个人信息。当您更新个人信息时，在我们处理您的请求前，会要求验证您的身份。一旦我们获得充分信息，可处理您的请求以访问或更正您的个人信息时，我们将在适用数据保护法规定的时间内对您的请求做出回应。*/}</li>
                <li>{intl.get(MODULE, 46)/*_i18n:基于您的要求，我们可免费提供一份我们已收集并处理的关于您的个人数据记录，如您提出对于相关信息的其他请求，我们可能会基于适用的相关法律，并结合实际的管理费用向您收取一笔合理的费用。*/}</li>
                <li>{intl.get(MODULE, 47)/*_i18n:如果您希望请求访问我们持有的个人数据或者如果您认为我们持有的关于您的任何信息是不正确或不完整的，请尽快致信或者向下方提供的电子邮箱地址发送电子邮件联系我们。电子邮箱：privacy@sunmi.com*/}</li>
                <li>{intl.get(MODULE, 48)/*_i18n:如果您是一般数据保护条例下规定的欧盟用户，您将有权要求我们删除您的个人数据。我们将会根据您的删除请求进行评估，若满足一般数据保护条例规定，我们将会采取包括技术手段在内的相应步骤进行处理。*/}</li>
                <li>{intl.get(MODULE, 49)/*_i18n:如果您是一般数据保护条例下规定的欧盟用户，您将有权要求我们限制处理您的个人数据。我们将会根据您的限制请求进行评估，若满足一般数据保护条例规定，我们将会根据条例中适用的具体情况处理您的数据，并在取消限制处理前通知您。*/}</li>
                <li>{intl.get(MODULE, 50)/*_i18n:如果您是一般数据保护条例下规定的欧盟用户，您将有权不受完全基于自动化决策的约束，具体包括用户画像等可对您产生法律效果或类似的重大影响。*/}</li>
                <li>{intl.get(MODULE, 51)/*_i18n:如果您是一般数据保护条例下规定的欧盟用户，您将有权以结构化、通用的形式收取您的个人数据并将其转移到其他数据控制者。*/}</li>
            </ul>
            <h3>{intl.get(MODULE, 52)/*_i18n:撤销同意*/}</h3>
            <ul>
                <li>{intl.get(MODULE, 53)/*_i18n:您可以通过提交请求，撤销同意收集、使用和/或披露我们掌握或控制的您的个人信息。我们将会在您做出请求后的合理时间内处理您的请求，并且会根据您的请求，在此后不再收集、使用和/或披露您的个人信息。*/}</li>
                <li>{intl.get(MODULE, 54)/*_i18n:请注意，您撤销同意会导致某些法律后果。根据您撤销同意让我们处理您的个人信息的范围，这可能表示您不能享受商米的产品和服务。*/}</li>
            </ul>
            <h2>{intl.get(MODULE, 55)/*_i18n:隐私政策的更新*/}</h2>
            <p>{intl.get(MODULE, 56)/*_i18n:我们会对隐私政策进行定期审核，为反映我们信息惯例的变更，我们可能会更新本隐私政策。如果我们对本隐私政策进行重大变更，我们将通过（向您账户指定的邮箱地址发送）电子邮件或在所有商米网站公布或通过移动设备通知您，这样您可以了解我们收集的信息以及我们如何使用这些信息。此类隐私政策变化将从通知或网站规定的生效日期开始适用。我们建议您定期查阅本网页获取我们隐私权实践的最新信息。您继续使用产品和网站、手机和/或其他任何设备上的服务，将被视为接受更新的隐私政策。在我们向您收集更多的个人信息或我们希望因为新的目的使用或披露您的个人信息时，我们会再次征得您的同意。*/}</p>
            <h2>{intl.get(MODULE, 57)/*_i18n:我是否必须同意任何第三方条款与条件？*/}</h2>
            <p>{intl.get(MODULE, 58)/*_i18n:我们的隐私政策不适用于第三方提供的产品和服务。商米产品和服务可能包括第三方的产品和服务，以及第三方网站的链接。当您使用这些产品或服务时，也可能收集您的信息。因此，我们强烈建议您花时间阅读该第三方的隐私政策，就像阅读我们的政策一样。我们不对第三方如何使用他们向您收集的个人信息负责，也不能控制其使用。我们的隐私政策不适用通过我们的服务链接的其他网站。*/}</p>
            <h2>{intl.get(MODULE, 59)/*_i18n:联系我们*/}</h2>
            <p>{intl.get(MODULE, 60)/*_i18n:如果您对本隐私政策有任何意见或问题，或者您对商米收集、使用或披露您的设备信息有任何问题，请通过下列地址联系我们，并提及“隐私政策 ”：*/}</p>
            <p>{intl.get(MODULE, 61)/*_i18n:上海商米科技有限公司*/}</p>
            <p>{intl.get(MODULE, 62)/*_i18n:上海市杨浦区淞沪路388号创智天地7号楼605*/}</p>
            <p>{intl.get(MODULE, 63)/*_i18n:邮政编码：200433*/}</p>
            <p>{intl.get(MODULE, 64)/*_i18n:电子邮箱：privacy@sunmi.com*/}</p>
            <p>{intl.get(MODULE, 65)/*_i18n:感谢您花时间了解我们的隐私政策！*/}</p>
        </div>
    );
}
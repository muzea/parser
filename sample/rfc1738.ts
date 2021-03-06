import {
  createParser,
  setParser,
  regex,
  seq,
  rep,
  alt,
  ch,
  opt,
  end
} from "../src/parser";

const genericurl = createParser();
const url = createParser();
const _scheme = createParser();
const scheme = createParser();
const schemepart = createParser();
const ipSchemepart = createParser();
const login = createParser();
const hostport = createParser();
const host = createParser();
const hostname = createParser();
const domainlabel = createParser();
const toplabel = createParser();
const alphadigit = createParser();
const hostnumber = createParser();
const port = createParser();
const otherurl = createParser();
const user = createParser();
const password = createParser();
const urlpath = createParser();
const ftpurl = createParser();
const newsurl = createParser();
const nntpurl = createParser();
const telneturl = createParser();
const gopherurl = createParser();
const waisurl = createParser();
const mailtourl = createParser();
const prosperourl = createParser();
const fpath = createParser();
const fsegment = createParser();
const ftptype = createParser();
const fileurl = createParser();
const httpurl = createParser();
const hpath = createParser();
const hsegment = createParser();
const search = createParser();
const lowalpha = createParser();
const hialpha = createParser();
const alpha = createParser();
const digit = createParser();
const safe = createParser();
const extra = createParser();
const national = createParser();
const punctuation = createParser();
const reserved = createParser();
const hex = createParser();
const escape = createParser();
const unreserved = createParser();
const uchar = createParser();
const xchar = createParser();
const digits = createParser();
const gtype = createParser();
const selector = createParser();
const gopher_string = createParser();
const encoded822addr = createParser();
const grouppart = createParser();
const group = createParser();
const _articlePart = createParser();
const article = createParser();
const waisdatabase = createParser();
const waisindex = createParser();
const waisdoc = createParser();
const database = createParser();
const wpath = createParser();
const wtype = createParser();
const ppath = createParser();
const fieldspec = createParser();
const psegment = createParser();
const fieldname = createParser();
const fieldvalue = createParser();
// const fieldspec = createParser();

// ; The generic form of a URL is:

// genericurl     = scheme ":" schemepart

setParser(genericurl, seq(scheme, ch(":"), schemepart));

// ; Specific predefined schemes are defined here; new schemes
// ; may be registered with IANA

// url            = httpurl | ftpurl | newsurl |
//                  nntpurl | telneturl | gopherurl |
//                  waisurl | mailtourl | fileurl |
//                  prosperourl | otherurl

setParser(
  url,
  alt(
    httpurl,
    ftpurl,
    newsurl,
    nntpurl,
    telneturl,
    gopherurl,
    waisurl,
    mailtourl,
    fileurl,
    prosperourl,
    otherurl,
  )
);

// ; new schemes follow the general syntax
// otherurl       = genericurl

setParser(otherurl, genericurl);

// ; the scheme is in lower case; interpreters should use case-ignore
// scheme         = 1*[ lowalpha | digit | "+" | "-" | "." ]

setParser(_scheme, alt(lowalpha, digit, ch("+"), ch("-"), ch(".")));

setParser(scheme, seq(_scheme, rep(_scheme)));

// schemepart     = *xchar | ip-schemepart

setParser(schemepart, alt(rep(xchar), ipSchemepart));

// ; URL schemeparts for ip based protocols:

// ip-schemepart  = "//" login [ "/" urlpath ]

setParser(ipSchemepart, seq(ch("//"), login, opt(seq(ch("/"), urlpath))));

// login          = [ user [ ":" password ] "@" ] hostport

setParser(
  login,
  seq(opt(seq(user, opt(seq(ch(":"), password)), ch("@"))), hostport)
);

// hostport       = host [ ":" port ]

setParser(hostport, seq(host, opt(seq(ch(":"), port))));

// host           = hostname | hostnumber

setParser(host, alt(hostname, hostnumber));

// hostname       = *[ domainlabel "." ] toplabel

setParser(
  hostname,
  seq(
    rep(
      seq(
        domainlabel,
        ch(".")
      )
    ),
    toplabel
  )
);

// domainlabel    = alphadigit | alphadigit *[ alphadigit | "-" ] alphadigit

setParser(
  domainlabel,
  alt(alphadigit, seq(alphadigit, rep(alt(alphadigit, ch("-"))), alphadigit))
);

// toplabel       = alpha | alpha *[ alphadigit | "-" ] alphadigit

setParser(
  toplabel,
  alt(alpha, seq(alpha, rep(alt(alphadigit, ch("-"))), alphadigit))
);

// alphadigit     = alpha | digit

setParser(alphadigit, alt(alpha, digit));

// hostnumber     = digits "." digits "." digits "." digits

setParser(
  hostnumber,
  seq(digits, ch("."), digits, ch("."), digits, ch("."), digits)
);

// port           = digits

// If set directly, it will be [[ undefined ]]
setParser(port, seq(digit, rep(digit)));

// user           = *[ uchar | ";" | "?" | "&" | "=" ]

setParser(user, rep(alt(uchar, ch(";"), ch("?"), ch("&"), ch("="))));

// password       = *[ uchar | ";" | "?" | "&" | "=" ]

setParser(password, rep(alt(uchar, ch(";"), ch("?"), ch("&"), ch("="))));

// urlpath        = *xchar    ; depends on protocol see section 3.1

setParser(urlpath, rep(xchar));

// ; The predefined schemes:

// ; FTP (see also RFC959)

// ftpurl         = "ftp://" login [ "/" fpath [ ";type=" ftptype ]]

setParser(
  ftpurl,
  seq(
    ch("ftp://"),
    login,
    opt(
      seq(
        ch("/"),
        fpath,
        opt(
          seq(
            ch(";type="),
            ftptype
          )
        )
      )
    )
  )
);

// fpath          = fsegment *[ "/" fsegment ]

setParser(fpath, seq(fsegment, rep(seq(ch("/"), fsegment))));

// fsegment       = *[ uchar | "?" | ":" | "@" | "&" | "=" ]

setParser(
  fsegment,
  rep(alt(uchar, ch("?"), ch(":"), ch("@"), ch("&"), ch("=")))
);

// ftptype        = "A" | "I" | "D" | "a" | "i" | "d"

setParser(ftptype, alt(ch("A"), ch("I"), ch("D"), ch("a"), ch("i"), ch("d")));

// ; FILE

// fileurl        = "file://" [ host | "localhost" ] "/" fpath

setParser(
  ftpurl,
  seq(ch("file://"), opt(alt(host, ch("localhost"))), ch("/"), fpath)
);

// ; HTTP

// httpurl        = "http://" hostport [ "/" hpath [ "?" search ]]

setParser(
  httpurl,
  seq(
    ch("http://"),
    hostport,
    opt(seq(ch("/"), hpath, opt(seq(ch("?"), search))))
  )
);

// hpath          = hsegment *[ "/" hsegment ]

setParser(hpath, seq(hsegment, rep(seq(ch("/"), hsegment))));

// hsegment       = *[ uchar | ";" | ":" | "@" | "&" | "=" ]

setParser(
  hsegment,
  rep(alt(uchar, ch(";"), ch(":"), ch("@"), ch("&"), ch("=")))
);

// search         = *[ uchar | ";" | ":" | "@" | "&" | "=" ]

setParser(search, rep(alt(uchar, ch(";"), ch(":"), ch("@"), ch("&"), ch("="))));

// ; GOPHER (see also RFC1436)

// gopherurl      = "gopher://" hostport [ / [ gtype [ selector
//                  [ "%09" search [ "%09" gopher+_string ] ] ] ] ]

// "gopher://" hostport [ / [ gtype [ selector [ "%09" search [ "%09" gopher+_string ] ] ] ] ]

setParser(
  gopherurl,
  seq(
    ch("gopher://"),
    hostport,
    opt(
      seq(
        ch("/"),
        opt(
          seq(
            gtype,
            opt(
              seq(
                selector,
                opt(
                  seq(
                    ch("%09"),
                    search,
                    opt(
                      seq(
                        ch("%09"),
                        gopher_string
                      )
                    )
                  )
                )
              )
            )
          )
        )
      )
    )
  )
);

// gtype          = xchar

setParser(gtype, alt(unreserved, reserved, escape));

// selector       = *xchar

setParser(selector, rep(xchar));

// gopher+_string = *xchar

setParser(gopher_string, rep(xchar));

// ; MAILTO (see also RFC822)

// mailtourl      = "mailto:" encoded822addr

setParser(mailtourl, seq(ch("mailto:"), encoded822addr));

// encoded822addr = 1*xchar               ; further defined in RFC822

setParser(encoded822addr, seq(xchar, rep(xchar)));

// ; NEWS (see also RFC1036)

// newsurl        = "news:" grouppart

setParser(newsurl, seq(ch("news:"), grouppart));

// grouppart      = "*" | group | article

setParser(grouppart, alt(ch("*"), group, article));

// group          = alpha *[ alpha | digit | "-" | "." | "+" | "_" ]

setParser(group, seq(alpha, rep(alt(
  alpha,
  digit,
  ch("-"),
  ch("."),
  ch("+"),
  ch("_"),
))));

// article        = 1*[ uchar | ";" | "/" | "?" | ":" | "&" | "=" ] "@" host

setParser(
  _articlePart,
  alt(
    uchar,
    ch(";"),
    ch("/"),
    ch("?"),
    ch(":"),
    ch("&"),
    ch("="),
  )
);

setParser(
  article,
  seq(
    _articlePart,
    rep(_articlePart),
    ch("@"),
    host
  )
);

// ; NNTP (see also RFC977)

// nntpurl        = "nntp://" hostport "/" group [ "/" digits ]

setParser(nntpurl, seq(ch("nntp:"), hostport, ch("/"), group, opt(seq(ch("/"), digits))));

// ; TELNET

// telneturl      = "telnet://" login [ "/" ]

setParser(telneturl, seq(ch("telnet:"), login, opt(ch("/"))));

// ; WAIS (see also RFC1625)

// waisurl        = waisdatabase | waisindex | waisdoc

setParser(
  waisurl,
  alt(
    waisdatabase,
    waisindex,
    waisdoc
  )
);

// waisdatabase   = "wais://" hostport "/" database

setParser(waisdatabase, seq(ch("wais://"), hostport, ch("/"), database));

// waisindex      = "wais://" hostport "/" database "?" search

setParser(waisindex, seq(ch("wais://"), hostport, ch("/"), database, ch("?"), search));

// waisdoc        = "wais://" hostport "/" database "/" wtype "/" wpath

setParser(waisindex, seq(ch("wais://"), hostport, ch("/"), database, ch("?"), search));

// database       = *uchar

setParser(database, rep(uchar));

// wtype          = *uchar

setParser(wtype, rep(uchar));

// wpath          = *uchar

setParser(wpath, rep(uchar));

// ; PROSPERO

// prosperourl    = "prospero://" hostport "/" ppath *[ fieldspec ]

setParser(prosperourl, seq(ch("prospero://"), hostport, ch("/"), ppath, rep(fieldspec)));

// ppath          = psegment *[ "/" psegment ]

setParser(ppath, seq(psegment, rep(seq(ch("/"), psegment))));

// psegment       = *[ uchar | "?" | ":" | "@" | "&" | "=" ]

setParser(psegment, rep(
  alt(
    uchar,
    ch("?"),
    ch(":"),
    ch("@"),
    ch("&"),
    ch("="),
  )
));

// fieldspec      = ";" fieldname "=" fieldvalue

setParser(fieldspec, seq(ch(";"), fieldname, ch("="), fieldvalue));

// fieldname      = *[ uchar | "?" | ":" | "@" | "&" ]

setParser(fieldname, rep(
  alt(
    uchar,
    ch("?"),
    ch(":"),
    ch("@"),
    ch("&")
  )
));

// fieldvalue     = *[ uchar | "?" | ":" | "@" | "&" ]

setParser(fieldvalue, rep(
  alt(
    uchar,
    ch("?"),
    ch(":"),
    ch("@"),
    ch("&")
  )
));


// ; Miscellaneous definitions

// lowalpha       = "a" | "b" | "c" | "d" | "e" | "f" | "g" | "h" |
//                  "i" | "j" | "k" | "l" | "m" | "n" | "o" | "p" |
//                  "q" | "r" | "s" | "t" | "u" | "v" | "w" | "x" |
//                  "y" | "z"

setParser(lowalpha, regex("[a-z]"));

// hialpha        = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | "I" |
//                  "J" | "K" | "L" | "M" | "N" | "O" | "P" | "Q" | "R" |
//                  "S" | "T" | "U" | "V" | "W" | "X" | "Y" | "Z"

setParser(hialpha, regex("[A-Z]"));

// alpha          = lowalpha | hialpha

setParser(alpha, alt(lowalpha, hialpha));

// digit          = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" |
//                  "8" | "9"

setParser(digit, regex("[0-9]"));

// safe           = "$" | "-" | "_" | "." | "+"

setParser(safe, alt(ch("$"), ch("-"), ch("_"), ch("."), ch("+")));

// extra          = "!" | "*" | "'" | "(" | ")" | ","

setParser(extra, alt(ch("!"), ch("*"), ch("'"), ch("("), ch(")"), ch(",")));

// national       = "{" | "}" | "|" | "\" | "^" | "~" | "[" | "]" | "`"

setParser(
  national,
  alt(
    ch("{"),
    ch("}"),
    ch("|"),
    ch("\\"),
    ch("^"),
    ch("~"),
    ch("["),
    ch("]"),
    ch("`")
  )
);

// punctuation    = "<" | ">" | "#" | "%" | <">

setParser(punctuation, alt(ch("<"), ch(">"), ch("#"), ch("%"), ch('"')));

// reserved       = ";" | "/" | "?" | ":" | "@" | "&" | "="

setParser(
  reserved,
  alt(ch(";"), ch("/"), ch("?"), ch(":"), ch("@"), ch("&"), ch("="))
);

// hex            = digit | "A" | "B" | "C" | "D" | "E" | "F" |
//                  "a" | "b" | "c" | "d" | "e" | "f"

setParser(hex, alt(digit, regex("[A-F]"), regex("[a-f]")));

// escape         = "%" hex hex

setParser(escape, seq(ch("%"), hex, hex));

// unreserved     = alpha | digit | safe | extra

setParser(unreserved, alt(alpha, digit, safe, extra));

// uchar          = unreserved | escape

setParser(uchar, alt(unreserved, escape));

// xchar          = unreserved | reserved | escape

setParser(xchar, alt(unreserved, reserved, escape));

// digits         = 1*digit

setParser(digits, seq(digit, rep(digit)));


const genericurlParser = createParser();
setParser(genericurlParser, seq(genericurl, end()));

function isGenericurl(input: string) {
  const result = genericurlParser[0](input);
  if (result.length) {
    return true;
  }
  return false;
}


const urlParser = createParser();
setParser(urlParser, seq(url, end()));

function isUrl(input: string) {
  const result = urlParser[0](input);
  if (result.length) {
    return true;
  }
  return false;
}


const httpurlParser = createParser();
setParser(httpurlParser, seq(httpurl, end()));

function isHttpurl(input: string) {
  const result = httpurlParser[0](input);
  if (result.length) {
    return true;
  }
  return false;
}


const ftpurlParser = createParser();
setParser(ftpurlParser, seq(ftpurl, end()));

function isFtpurl(input: string) {
  const result = ftpurlParser[0](input);
  if (result.length) {
    return true;
  }
  return false;
}


const newsurlParser = createParser();
setParser(newsurlParser, seq(newsurl, end()));

function isNewsurl(input: string) {
  const result = newsurlParser[0](input);
  if (result.length) {
    return true;
  }
  return false;
}


const nntpurlParser = createParser();
setParser(nntpurlParser, seq(nntpurl, end()));

function isNntpurl(input: string) {
  const result = nntpurlParser[0](input);
  if (result.length) {
    return true;
  }
  return false;
}


const telneturlParser = createParser();
setParser(telneturlParser, seq(telneturl, end()));

function isTelneturl(input: string) {
  const result = telneturlParser[0](input);
  if (result.length) {
    return true;
  }
  return false;
}


const gopherurlParser = createParser();
setParser(gopherurlParser, seq(gopherurl, end()));

function isGopherurl(input: string) {
  const result = gopherurlParser[0](input);
  if (result.length) {
    return true;
  }
  return false;
}


const waisurlParser = createParser();
setParser(waisurlParser, seq(waisurl, end()));

function isWaisurl(input: string) {
  const result = waisurlParser[0](input);
  if (result.length) {
    return true;
  }
  return false;
}


const mailtourlParser = createParser();
setParser(mailtourlParser, seq(mailtourl, end()));

function isMailtourl(input: string) {
  const result = mailtourlParser[0](input);
  if (result.length) {
    return true;
  }
  return false;
}


const fileurlParser = createParser();
setParser(fileurlParser, seq(fileurl, end()));

function isFileurl(input: string) {
  const result = fileurlParser[0](input);
  if (result.length) {
    return true;
  }
  return false;
}


const prosperourlParser = createParser();
setParser(prosperourlParser, seq(prosperourl, end()));

function isProsperourl(input: string) {
  const result = prosperourlParser[0](input);
  if (result.length) {
    return true;
  }
  return false;
}


const otherurlParser = createParser();
setParser(otherurlParser, seq(otherurl, end()));

function isOtherurl(input: string) {
  const result = otherurlParser[0](input);
  if (result.length) {
    return true;
  }
  return false;
}


export {
  isGenericurl,
  isUrl,
  isHttpurl,
  isFtpurl,
  isNewsurl,
  isNntpurl,
  isTelneturl,
  isGopherurl,
  isWaisurl,
  isMailtourl,
  isFileurl,
  isProsperourl,
  isOtherurl,
};

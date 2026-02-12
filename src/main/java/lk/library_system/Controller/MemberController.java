package lk.library_system.Controller;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import lk.library_system.Dao.MemeberDao;
import lk.library_system.Entity.MembersEntity;

@RestController
public class MemberController {

    @Autowired
    private MemeberDao memberDao;

    // request mapping for load members UI
    @RequestMapping(value = "/members")
    public ModelAndView membersUI() {
        // create ModelAndView instance
        ModelAndView membersView = new ModelAndView();
        membersView.setViewName("members.html");
        membersView.addObject("title", "Members Management");

        return membersView;
    }

    // define mapping get all members data -- URL [/members/alldata]
    @GetMapping(value = "/members/alldata", produces = "application/json")
    public List<MembersEntity> getAllCustomers() {
        return memberDao.findAll(Sort.by(Direction.DESC, "id"));
    }

    @PostMapping(value = "/members/add")
    public String registerMember(@RequestBody MembersEntity member) {

        try {
            // set auto generate value
            member.setAddeddatetime(LocalDateTime.now());
            member.setMembercode(memberDao.getNextMemberCode());

            // do save operation
            memberDao.save(member);

            return "OK";
        } catch (Exception e) {
            return "Save not Completed : " + e.getMessage();
        }
    }
}
